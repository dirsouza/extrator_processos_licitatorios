import { ProcessingLogDto } from '../dto/processing-log.dto';
import { ProcessingLogParamsDto } from '../dto/processing-log-params.dto';

export interface ProcessingLogRepository {
  findProcessingLogById(id: string): Promise<ProcessingLogDto>;
  findLastProcessingLog(): Promise<ProcessingLogDto>;
  saveProcessingLog(params: ProcessingLogParamsDto): Promise<ProcessingLogDto>;
  updateProcessingLog(
    id: string,
    params: ProcessingLogParamsDto,
  ): Promise<boolean>;
  deleteProcessingLog(id: string): Promise<boolean>;
}
