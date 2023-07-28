import { BaseInputDto } from "../domain/dto/base.dto"
import { IBaseRepository } from "../domain/ports/repository/repository.interface"
import { IResultTransaction } from "../domain/responses/generic-response.response"
import { PaginationQuery } from "../domain/dto/pagination-query.dto"
import { IListPage } from "../domain/responses/list-page.response"

/**
 * Abstract Class UseCase.
 *
 * @constructor
 */
export abstract class UseCase<T> implements IBaseRepository<T> {

  constructor(
    private readonly repository: IBaseRepository<T>
  ) { }

  async listPage(queryParams: PaginationQuery): Promise<IListPage<T | null | unknown>> {

    const listPage = await this.repository.listPage(queryParams)

    return listPage
  }

  async findAll(): Promise<T[] | null | unknown> {

    const entities = await this.repository.findAll()

    return entities
  }

  async findById(id: number): Promise<T | null | unknown> {

    const findEntity = await this.repository.findById(id)

    return findEntity
  }

  async create(attrs: BaseInputDto): Promise<IResultTransaction> {

    const result = await this.repository.create(attrs)

    return result
  }

  async update(id: number, attrs: BaseInputDto): Promise<IResultTransaction> {

    const result = await this.repository.update(id, attrs)

    return result
  }

  async remove(id: number): Promise<IResultTransaction> {

    const result = await this.repository.remove(id)

    return result
  }
}