import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { BiddingItemParticipation } from './bidding-item-participation.schema';

@Schema({ collection: 'bidding_item', _id: false })
export class BiddingItem extends Document {
  @Prop({ type: String })
  descricao: string;

  @Prop({ type: Number })
  quantidade: number;

  @Prop({ type: Number })
  valorReferencia: number;

  @Prop({ type: Number })
  codigo: number;

  @Prop({ type: Types.ObjectId, ref: 'BiddingItemParticipation' })
  participacao: BiddingItemParticipation;
}

export const BiddingItemSchema = SchemaFactory.createForClass(BiddingItem).set(
  'toJSON',
  {
    virtuals: true,
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
    },
  },
);
