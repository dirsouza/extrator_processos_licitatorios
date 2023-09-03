import { HttpService } from '@nestjs/axios';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Job, Queue } from 'bull';
import { isEmpty } from 'class-validator';
import { firstValueFrom } from 'rxjs';

import { ExtractionStatusEnum } from '../../../../common/enum/extraction-status.enum';
import { QueueActionEnum } from '../../../../common/enum/queue-action.enum';
import { RequesterEnum } from '../../../../common/enum/requester.enum';
import { ArrayHelper } from '../../../../common/helper/array.helper';
import { DateHelper } from '../../../../common/helper/date.helper';
import { DITokens } from '../../../../config/container.config';
import {
  envConfig,
  EnvironmentConfig,
} from '../../../../config/environment.config';
import { BiddingDto } from '../dto/bidding.dto';
import { BiddingItemDto } from '../dto/bidding-item.dto';
import { JobRequestDto } from '../dto/job-request.dto';
import { PaginatedItensResult } from '../dto/paginated-itens-result.dto';
import { PaginatedResult } from '../dto/paginated-result.dto';
import { ProcessingLogDto } from '../dto/processing-log.dto';
import { BiddingRepository } from '../repository/bidding.repository';
import { ProcessingLogRepository } from '../repository/processing-log.repository';
import { BiddingExtractionUseCase } from '../use-case/bidding-extraction.use-case';

@Injectable()
@Processor(envConfig.queueName)
export class BiddingExtractionService implements BiddingExtractionUseCase {
  private readonly logger = new Logger(BiddingExtractionService.name);

  constructor(
    @InjectQueue(envConfig.queueName)
    private readonly extractionQueue: Queue,

    private readonly httpService: HttpService,

    @Inject(DITokens.ENVIRONMENT_CONFIG)
    private readonly env: EnvironmentConfig,

    @Inject(DITokens.PROCESSING_LOG_REPOSITORY)
    private readonly procLogRepo: ProcessingLogRepository,

    @Inject(DITokens.BIDDING_REPOSITORY)
    private readonly biddingRepo: BiddingRepository,
  ) {}

  @Cron('0 8,12,16,20 * * *')
  @Process(envConfig.queueJob)
  async execute(job?: Job<JobRequestDto>): Promise<void> {
    this.logger.log('Iniciando extração dos processos licitatórios.');

    const procExists = await this.checkIfProcessingExists();
    if (procExists) {
      this.logger.log('Já existe um processo de extração em andamento.');

      if (job?.data?.requester) {
        this.extractionQueue.add(
          envConfig.queueJob,
          {
            requester: job?.data?.requester,
          },
          { priority: 1 },
        );
        await this.queueAction(QueueActionEnum.PAUSE);
      }

      return;
    }

    const procLog = await this.createProcessing(
      job?.data?.requester ?? RequesterEnum.SYSTEM,
    );

    try {
      const biddings = await this.getBiddingsAndBiddingItens();

      await this.biddingRepo.deleteBiddings(biddings);
      await this.biddingRepo.updateBiddings(biddings);
      await this.createBiddings(biddings);
      await this.updateProcessing(procLog.id, ExtractionStatusEnum.FINISHED);
    } catch (error) {
      await this.updateProcessing(procLog.id, ExtractionStatusEnum.ERROR);
      throw error;
    }
  }

  private async checkIfProcessingExists(): Promise<boolean> {
    const lastProcLog = await this.procLogRepo.findLastProcessingLog();
    if (!lastProcLog) return false;

    return (
      isEmpty(lastProcLog?.endDate) &&
      lastProcLog?.extractionStatus === ExtractionStatusEnum.IN_PROGRESS
    );
  }

  private async getBiddingsAndBiddingItens(): Promise<BiddingDto[]> {
    try {
      const biddings: BiddingDto[] = [];
      for await (const bidding of this.getBiddings()) {
        biddings.push(...bidding);
      }

      for (const bidding of biddings) {
        const { codigoLicitacao } = bidding;
        for await (const biddingItem of this.getBiddingsItens(
          codigoLicitacao,
        )) {
          bidding.itens = biddingItem;
        }
      }

      return biddings;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  private async createProcessing(
    requester: RequesterEnum,
  ): Promise<ProcessingLogDto> {
    await this.queueAction(QueueActionEnum.PAUSE);

    return this.procLogRepo.saveProcessingLog({
      startDate: DateHelper.nowUTC(),
      extractionStatus: ExtractionStatusEnum.IN_PROGRESS,
      requester,
    });
  }

  private async updateProcessing(
    id: string,
    status: ExtractionStatusEnum,
  ): Promise<void> {
    await this.queueAction(QueueActionEnum.RESUME);

    await this.procLogRepo.updateProcessingLog(id, {
      endDate: DateHelper.nowUTC(),
      extractionStatus: status,
    });
  }

  private async queueAction(action: QueueActionEnum): Promise<void> {
    const queuePaused = await this.extractionQueue.isPaused();

    if (action === QueueActionEnum.PAUSE && !queuePaused) {
      this.extractionQueue.pause();
    }

    if (action === QueueActionEnum.RESUME && queuePaused) {
      this.extractionQueue.resume();
    }
  }

  private async *getBiddings(): AsyncGenerator<BiddingDto[]> {
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const { data } = await firstValueFrom(
        this.httpService.get<PaginatedResult<BiddingDto>>(
          `${this.env.biddingProcessesUrl}/v2/licitacao/processos?filtroEspecial=1&filtroOrdenacao=1&pagina=${page}`,
        ),
      );

      if (data?.offset === data?.pageCount) {
        hasNextPage = false;
      }

      yield data?.result?.map((bidding) => ({
        codigoLicitacao: bidding?.codigoLicitacao ?? null,
        identificacao: bidding?.identificacao ?? null,
        numero: bidding?.numero ?? null,
        resumo: bidding?.resumo ?? null,
        codigoSituacaoEdital: bidding?.codigoSituacaoEdital ?? null,
        status: { code: bidding?.status?.code ?? null },
        itens: [],
      }));
      page++;
    }
  }

  private async *getBiddingsItens(
    codigoLicitacao: number,
  ): AsyncGenerator<BiddingItemDto[]> {
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const { data } = await firstValueFrom(
        this.httpService.get<PaginatedItensResult<BiddingItemDto>>(
          `${this.env.biddingProcessesUrl}/v2/licitacao/${codigoLicitacao}/itens?pagina=${page}`,
        ),
      );

      if (!data?.itens?.nextPage) {
        hasNextPage = false;
      }

      yield data?.itens?.result?.map((item) => ({
        descricao: item?.descricao ?? null,
        quantidade: item?.quantidade ?? null,
        valorReferencia: item?.valorReferencia ?? null,
        codigo: item?.codigo ?? null,
        participacao: { code: item?.participacao?.code ?? null },
      }));
      page++;
    }
  }

  private async createBiddings(biddings: BiddingDto[]): Promise<void> {
    const biddingsToCreate: BiddingDto[] = [];

    const chunks = ArrayHelper.chunk(biddings, 1000);
    for (const chunk of chunks) {
      const existingBiddings = await this.biddingRepo.findBiddingsByCodes(
        chunk?.map((bidding) => bidding?.codigoLicitacao),
      );

      const biddingCodes = new Set(
        existingBiddings?.map((bidding) => bidding?.codigoLicitacao),
      );

      const toCreate = chunk?.filter(
        (bidding) => !biddingCodes.has(bidding?.codigoLicitacao),
      );

      if (toCreate?.length) {
        biddingsToCreate.push(...toCreate);
      }
    }

    await this.biddingRepo.saveBiddings(biddingsToCreate);
  }
}
