import { ApiProperty } from '@nestjs/swagger';

import { BiddingResponseDto } from './bidding-response.dto';

export class BiddingPaginatedResponseDto {
  @ApiProperty({ type: BiddingResponseDto, isArray: true, required: true })
  items: BiddingResponseDto[];

  @ApiProperty({ required: true })
  totalItems: number;

  @ApiProperty({ required: true })
  totalPages: number;

  @ApiProperty({ required: true })
  currentPage: number;

  @ApiProperty({ required: true })
  pageSize: number;
}
