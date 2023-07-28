import { PaginationQuery } from "../../dto/pagination-query.dto"
import { IListPage } from "../../responses/list-page.response"

/**
 * Interface Reader Data in Repository.
 *
 * @interface
 */
export interface IReaderRepository<I> {

  /**
   * List Page Data (Pagination)
   *
   * @param queryParams
   */
  listPage(queryParams: PaginationQuery): Promise<IListPage<I | null | unknown>>

  /**
   * Find Element By Id Entity.
   *
   * @param {Number} id
   * @returns Promise<I | null>
   */
  findById(id: number): Promise<I | null | unknown>

  /**
   * Find All Elements
   *
   * d
   * @returns Promise<I[] | null>
   */
  findAll(): Promise<I[] | null | unknown>
}