import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { BiddingItem, BiddingItemSchema } from './bidding-item.schema';
import { BiddingStatus, BiddingStatusSchema } from './bidding-status.schema';

@Schema({ collection: 'bidding', timestamps: true })
export class Bidding extends Document {
  @Prop({ type: Number })
  codigoLicitacao: number;

  @Prop({ type: String })
  identificacao: string;

  @Prop({ type: String })
  numero: string;

  @Prop({ type: String })
  resumo: string;

  @Prop({ type: Number })
  codigoSituacaoEdital: number;

  @Prop({ type: BiddingStatusSchema })
  status: BiddingStatus;

  @Prop({ type: [BiddingItemSchema] })
  itens: BiddingItem[];
}

export const BiddingSchema = SchemaFactory.createForClass(Bidding).set(
  'toJSON',
  {
    virtuals: true,
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
    },
  },
);
