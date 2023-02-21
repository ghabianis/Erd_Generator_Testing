export interface PaginatedInterface<T> {
    readonly paginatedResult: T[] | [];
    readonly totalCount: number;
  }