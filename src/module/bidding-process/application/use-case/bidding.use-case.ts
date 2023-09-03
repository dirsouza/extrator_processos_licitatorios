import { BiddingPaginatedDto } from '../dto/bidding-paginated.dto';
import { FilterRequestDto } from '../dto/filter-request.dto';

export interface BiddingUseCase {
  execute(filter: FilterRequestDto): Promise<BiddingPaginatedDto>;
}
