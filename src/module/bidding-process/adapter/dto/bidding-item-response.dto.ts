import { ApiProperty } from '@nestjs/swagger';

import { BiddingItemParticipationResponseDto } from './bidding-item-participation-response.dto';

export class BiddingItemResponseDto {
  @ApiProperty({ required: true })
  descricao: string;

  @ApiProperty({ required: true })
  quantidade: number;

  @ApiProperty({ required: true })
  valorReferencia: number;

  @ApiProperty({ required: true })
  codigo: number;

  @ApiProperty({ type: BiddingItemParticipationResponseDto, required: true })
  participacao: BiddingItemParticipationResponseDto;
}
