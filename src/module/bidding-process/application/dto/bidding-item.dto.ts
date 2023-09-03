import { BiddingItemParticipationDto } from './bidding-item-participation.dto';

export interface BiddingItemDto {
  descricao: string;
  quantidade: number;
  valorReferencia: number;
  codigo: number;
  participacao: BiddingItemParticipationDto;
}
