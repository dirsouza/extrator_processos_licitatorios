import { BiddingDto } from './bidding.dto';

export interface BiddingPaginatedDto {
  items: BiddingDto[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
