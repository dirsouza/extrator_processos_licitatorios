import { BiddingDto } from '../dto/bidding.dto';
import { BiddingPaginatedDto } from '../dto/bidding-paginated.dto';
import { FilterRequestDto } from '../dto/filter-request.dto';

export interface BiddingRepository {
  findBiddings(filter: FilterRequestDto): Promise<BiddingPaginatedDto>;
  findBiddingsByCodes(biddingCodes: number[]): Promise<BiddingDto[]>;
  saveBiddings(biddings: BiddingDto[]): Promise<BiddingDto[]>;
  updateBiddings(biddings: BiddingDto[]): Promise<void>;
  deleteBiddings(biddings: BiddingDto[]): Promise<void>;
}
