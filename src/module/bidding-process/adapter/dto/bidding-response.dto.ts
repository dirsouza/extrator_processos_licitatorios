import { ApiProperty } from '@nestjs/swagger';

import { BiddingItemResponseDto } from './bidding-item-response.dto';
import { BiddingStatusResponseDto } from './bidding-status-response.dto';

export class BiddingResponseDto {
  @ApiProperty({ required: true })
  codigoLicitacao: number;

  @ApiProperty({ required: true })
  identificacao: string;

  @ApiProperty({ required: true })
  numero: string;

  @ApiProperty({ required: true })
  resumo: string;

  @ApiProperty({ required: true })
  codigoSituacaoEdital: number;

  @ApiProperty({
    type: BiddingStatusResponseDto,
    required: true,
  })
  status: BiddingStatusResponseDto;

  @ApiProperty({
    type: BiddingItemResponseDto,
    isArray: true,
    required: true,
  })
  itens: BiddingItemResponseDto[];
}
