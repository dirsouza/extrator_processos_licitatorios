import { ApiProperty } from '@nestjs/swagger';

export class ExtractionResponseDto {
  @ApiProperty({ example: 'Extração iniciada' })
  message: string;
}
