import { BiddingItemDto } from './bidding-item.dto';
import { BiddingStatusDto } from './bidding-status.dto';

export interface BiddingDto {
  id?: string;
  codigoLicitacao: number;
  identificacao: string;
  numero: string;
  resumo: string;
  codigoSituacaoEdital: number;
  status: BiddingStatusDto;
  itens: BiddingItemDto[];
  createdAt?: Date;
  updatedAt?: Date;
}
