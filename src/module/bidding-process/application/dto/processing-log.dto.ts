import { ExtractionStatusEnum } from '../../../../common/enum/extraction-status.enum';
import { RequesterEnum } from '../../../../common/enum/requester.enum';

export interface ProcessingLogDto {
  id: string;
  startDate: Date;
  endDate: string;
  extractionStatus: ExtractionStatusEnum;
  requester: RequesterEnum;
}
