export interface IListPage<T> {
  page: number,
  limit: number,
  totalRecords: number,
  items: T[]
}