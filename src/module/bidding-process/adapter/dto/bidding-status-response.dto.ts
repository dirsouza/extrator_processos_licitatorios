import { ApiProperty } from '@nestjs/swagger';

export class BiddingStatusResponseDto {
  @ApiProperty({ required: true })
  code: number;
}
