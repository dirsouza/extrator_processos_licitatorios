import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'bidding_status', _id: false })
export class BiddingStatus extends Document {
  @Prop({ type: Number })
  code: number;
}

export const BiddingStatusSchema = SchemaFactory.createForClass(
  BiddingStatus,
).set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
  },
});
