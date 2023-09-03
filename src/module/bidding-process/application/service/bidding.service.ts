import { Inject, Injectable } from '@nestjs/common';

import { DITokens } from '../../../../config/container.config';
import { BiddingPaginatedDto } from '../dto/bidding-paginated.dto';
import { FilterRequestDto } from '../dto/filter-request.dto';
import { BiddingRepository } from '../repository/bidding.repository';
import { BiddingUseCase } from '../use-case/bidding.use-case';

@Injectable()
export class BiddingService implements BiddingUseCase {
  constructor(
    @Inject(DITokens.BIDDING_REPOSITORY)
    private readonly biddingRepo: BiddingRepository,
  ) {}

  async execute(filter: FilterRequestDto): Promise<BiddingPaginatedDto> {
    return this.biddingRepo.findBiddings(filter);
  }
}
