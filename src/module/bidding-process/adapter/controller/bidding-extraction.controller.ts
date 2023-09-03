import { InjectQueue } from '@nestjs/bull';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import { plainToClass } from 'class-transformer';

import { RequesterEnum } from '../../../../common/enum/requester.enum';
import { envConfig } from '../../../../config/environment.config';
import { ExtractionResponseDto } from '../dto/extraction-response.dto';

@Controller('biddings/extraction-processes')
@ApiTags('Biddings')
export class BiddingExtractionController {
  constructor(
    @InjectQueue(envConfig.queueName)
    private readonly extractionQueue: Queue,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ExtractionResponseDto })
  @ApiOperation({
    summary: 'Extrai os processos de licitação.',
    description: 'Extrair os processos de licitação dos próximos 30 dias.',
  })
  async run(): Promise<ExtractionResponseDto> {
    this.extractionQueue.add(envConfig.queueJob, {
      requester: RequesterEnum.REQUESTED,
    });

    return plainToClass(ExtractionResponseDto, {
      message: 'Extração de processos de licitação agendado com sucesso!',
    });
  }
}
