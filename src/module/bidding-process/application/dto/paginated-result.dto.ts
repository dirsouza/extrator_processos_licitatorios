export interface PaginatedResult<T> {
  result: T[];
  offset: number;
  limit: number;
  total: number;
  pageCount?: number;
  currentPage?: number;
  nextPage?: number;
  previousPage?: number;
}
