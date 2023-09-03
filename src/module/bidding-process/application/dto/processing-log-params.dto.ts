import { ExtractionStatusEnum } from '../../../../common/enum/extraction-status.enum';
import { RequesterEnum } from '../../../../common/enum/requester.enum';

export interface ProcessingLogParamsDto {
  startDate?: Date;
  endDate?: Date;
  extractionStatus?: ExtractionStatusEnum;
  requester?: RequesterEnum;
}
