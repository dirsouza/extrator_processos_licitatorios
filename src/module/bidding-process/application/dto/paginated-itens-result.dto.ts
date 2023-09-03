import { PaginatedResult } from './paginated-result.dto';

export interface PaginatedItensResult<T> {
  isLote: boolean;
  itens: PaginatedResult<T>;
}
