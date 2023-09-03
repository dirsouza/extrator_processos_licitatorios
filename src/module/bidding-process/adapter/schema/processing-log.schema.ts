import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ExtractionStatusEnum } from '../../../../common/enum/extraction-status.enum';
import { RequesterEnum } from '../../../../common/enum/requester.enum';

@Schema({ collection: 'processing_log' })
export class ProcessingLog {
  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({
    type: String,
    required: true,
    enum: [
      ExtractionStatusEnum.IN_PROGRESS,
      ExtractionStatusEnum.FINISHED,
      ExtractionStatusEnum.ERROR,
    ],
  })
  extractionStatus: string;

  @Prop({
    type: String,
    required: true,
    enum: [RequesterEnum.REQUESTED, RequesterEnum.SYSTEM],
  })
  requester: string;
}

export const ProcessingLogSchema = SchemaFactory.createForClass(
  ProcessingLog,
).set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
  },
});
