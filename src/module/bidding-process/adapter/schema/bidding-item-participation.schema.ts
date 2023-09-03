import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'bidding_item_participation' })
export class BiddingItemParticipation extends Document {
  @Prop({ type: Number })
  code: number;
}

export const BiddingItemParticipationSchema = SchemaFactory.createForClass(
  BiddingItemParticipation,
).set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
  },
});
