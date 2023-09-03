import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { DITokens } from '../../../../config/container.config';
import { BiddingUseCase } from '../../application/use-case/bidding.use-case';
import { BiddingPaginatedResponseDto } from '../dto/bidding-paginated-response.dto';
import { FilterRequestDto } from '../dto/filter-request.dto';

@Controller('biddings')
@ApiTags('Biddings')
export class BiddingController {
  constructor(
    @Inject(DITokens.BIDDING_SERVICE)
    private readonly biddingService: BiddingUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: BiddingPaginatedResponseDto })
  @ApiOperation({
    summary: 'Retorna os processos de licitação.',
    description: 'Retornar os processos de licitação dos próximos 30 dias.',
  })
  async biddings(
    @Query() filter: FilterRequestDto,
  ): Promise<BiddingPaginatedResponseDto> {
    return this.biddingService.execute(filter);
  }
}
