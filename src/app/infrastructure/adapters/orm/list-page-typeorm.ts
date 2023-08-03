import { SelectQueryBuilder } from "typeorm"
import { camelCase } from "change-case"
import { plainToInstance } from "class-transformer"

import { BaseInputDto } from "../../../domain/dto/base.dto"
import { IListPage } from "../../../domain/responses/list-page.interface"

export interface BuildListPageOptions {
  alias?: string
  page: number
  limit: number
  aggregates?: (queryBuilder: SelectQueryBuilder<unknown>) => SelectQueryBuilder<unknown>
}

export async function BuildListPage<T, D>(entityMapper: typeof BaseInputDto, queryBuilder: SelectQueryBuilder<T>, options: BuildListPageOptions) {

  const alias = options.alias ?? "c"
  const page = options.page ?? 1
  const limit = options.limit ?? 5

  const queryBase = queryBuilder.clone()

  const aggregates = options.aggregates ? options.aggregates(queryBase) : queryBase

  const countQuery = aggregates.clone()

  const promises: [
    Promise<T[]>,
    Promise<{ totalRecords: number }>
  ] = [
      queryBase.limit(limit).offset((page - 1) * limit).orderBy(`${alias}.created_at`, "DESC").getRawMany(),
      countQuery.select("count(*)", "totalRecords").getRawOne<{ totalRecords: number }>()
    ]

  const [entities, totalCount] = await Promise.all(promises)


  const buildEntities = entities.map((item) => {

    const columns = Object.keys(item)

    let entityMapper = {}


    columns.forEach((it) => {

      const removePrefix = camelCase(it.replace(`${alias}_`, ""))
      const el = item[it]

      entityMapper = {
        ...entityMapper,
        [removePrefix]: el
      }
    })

    return entityMapper
  })

  return <IListPage<D>>{
    page: page,
    limit: limit,
    totalRecords: +totalCount.totalRecords,
    items: plainToInstance(entityMapper, buildEntities)
  }
}