import { ApiProperty } from '@nestjs/swagger';

export class BiddingItemParticipationResponseDto {
  @ApiProperty({ required: true })
  code: number;
}
