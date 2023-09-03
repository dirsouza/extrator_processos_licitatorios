import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProcessingLogDto } from '../../application/dto/processing-log.dto';
import { ProcessingLogParamsDto } from '../../application/dto/processing-log-params.dto';
import { ProcessingLogRepository } from '../../application/repository/processing-log.repository';
import { ProcessingLog } from '../schema/processing-log.schema';

@Injectable()
export class ProcessingLogMongoRepository implements ProcessingLogRepository {
  private readonly logger = new Logger(ProcessingLogMongoRepository.name);

  constructor(
    @InjectModel(ProcessingLog.name)
    private readonly procLogRepo: Model<ProcessingLog>,
  ) {}

  async findProcessingLogById(id: string): Promise<ProcessingLogDto> {
    this.logger.log(`Buscando log de processamento pelo id: "${id}".`);

    try {
      const procLog = await this.procLogRepo.findById(id).exec();

      if (!procLog) {
        throw new NotFoundException(
          `Log de processamento pelo id: "${id}" não encontrado.`,
        );
      }

      return procLog?.toJSON();
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async findLastProcessingLog(): Promise<ProcessingLogDto> {
    this.logger.log('Buscando último log de processamento.');

    try {
      const procLog = await this.procLogRepo.findOne().sort({ _id: -1 }).exec();

      return procLog?.toJSON();
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async saveProcessingLog(
    params: ProcessingLogParamsDto,
  ): Promise<ProcessingLogDto> {
    this.logger.log(
      `Salvando log de processamento: "${JSON.stringify(params)}".`,
    );

    try {
      const saveProcLog = new this.procLogRepo(params);
      const procLog = await saveProcLog.save();

      return procLog?.toJSON();
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async updateProcessingLog(
    id: string,
    params: ProcessingLogParamsDto,
  ): Promise<boolean> {
    this.logger.log(
      `Atualizando log de processamento: "${JSON.stringify({
        id,
        ...params,
      })}".`,
    );

    try {
      const updatedProcLog = await this.procLogRepo.updateOne(
        { _id: id },
        params,
      );

      return updatedProcLog.acknowledged;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async deleteProcessingLog(id: string): Promise<boolean> {
    this.logger.log(`Deletando log de processamento pelo id: "${id}".`);

    try {
      const deletedProcLog = await this.procLogRepo.deleteOne({ _id: id });

      return deletedProcLog.acknowledged;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }
}
