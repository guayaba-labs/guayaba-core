import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { DataSource, Repository, QueryRunner } from "typeorm"
import { BaseEntity } from "./base.entity"
import { IBaseRepository } from "../../domain/ports/repository/repository.interface"
import { BaseInputDto } from "../../domain/dto/base.dto"
import { IResultTransaction } from "../../domain/responses/generic-response.response"
import { PaginationQuery } from "../../domain/dto/pagination-query.dto"
import { BuildListPage } from "./orm/list-page-typeorm"
import { ListPageResponse } from "../../domain/responses/list-page.response"

export function BaseTypeOrmService<T extends BaseEntity, D>(entity: typeof BaseEntity, entityDomain: any) {

  @Injectable()
  abstract class TypeOrmBaseImplement implements IBaseRepository<D> {
    _dataSource: DataSource
    _engineRepo: Repository<T>

    constructor(
      dataSource: DataSource,
      engineRepo: Repository<T>
    ) {
      this._dataSource = dataSource
      this._engineRepo = engineRepo
    }

    async listPage({ limit, page }: PaginationQuery): Promise<ListPageResponse> {

      const queryBase = this._engineRepo.createQueryBuilder("c")

      const resultList = await BuildListPage<T, D>(entityDomain, queryBase, {
        page: page,
        limit: limit
      })

      return <ListPageResponse> {
        page: resultList.page,
        limit: resultList.limit,
        items: resultList.items
      }
    }

    async findById(id: number): Promise<D | null | unknown> {

      const findEntity: T = await this._engineRepo.createQueryBuilder("c")
        .where(`c.${entity.getIdPropertyName()} = :${entity.getIdPropertyName()}`, {
          [`${entity.getIdPropertyName()}`]: id
        }).getOne()

      const mapper: D = plainToInstance(entityDomain, findEntity) as D

      return mapper
    }

    async findAll(): Promise<D[] | null | unknown> {

      const entities: T[] = await this._engineRepo.createQueryBuilder("c")
        .getMany()

      const mappers = plainToInstance(entityDomain, entities) as D[]

      return mappers
    }

    async create(attrs: BaseInputDto, transaction?: QueryRunner): Promise<IResultTransaction> {

      const queryRunner = transaction ?? this._dataSource.createQueryRunner()

      if (!transaction) {
        await queryRunner.connect()
        await queryRunner.startTransaction()
      }

      try {

        const mapperDto = plainToInstance(entity, attrs) as T

        const result = await queryRunner.manager.save(mapperDto)

        if (!transaction)
          await queryRunner.commitTransaction()

        return <IResultTransaction>{
          ok: true,
          message: `Operation Created Successful`,
          data: {
            [`${entity.getIdPropertyName()}`]: result[entity.getIdPropertyName()]
          }
        }
      } catch (error) {
        if (!transaction)
          await queryRunner.rollbackTransaction()

        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        }, HttpStatus.FORBIDDEN, {
          cause: error
        })
      } finally {
        if (!transaction)
          await queryRunner.release()
      }
    }

    async update(id: number, attrs: BaseInputDto, transaction?: QueryRunner): Promise<IResultTransaction> {

      const queryRunner = transaction ?? this._dataSource.createQueryRunner()

      if (!transaction) {
        await queryRunner.connect()
        await queryRunner.startTransaction()
      }

      try {

        const mapperDto = plainToInstance(entity, attrs) as T

        await queryRunner.manager.update(entity, {
          [entity.getIdPropertyName()]: id
        }, mapperDto)

        if (!transaction)
          await queryRunner.commitTransaction()

        return <IResultTransaction>{
          ok: true,
          message: `Operation Updated Successful`,
          data: {
            [`${entity.getIdPropertyName()}`]: id
          }
        }
      } catch (error) {
        if (!transaction)
          await queryRunner.rollbackTransaction()

        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        }, HttpStatus.FORBIDDEN, {
          cause: error
        })
      } finally {
        if (!transaction)
          await queryRunner.release()
      }
    }

    async remove(id: number, transaction?: QueryRunner): Promise<IResultTransaction> {
      const queryRunner = transaction ?? this._dataSource.createQueryRunner()

      if (!transaction) {
        await queryRunner.connect()
        await queryRunner.startTransaction()
      }

      try {

        await queryRunner.manager
          .createQueryBuilder()
          .softDelete()
          .from(entity)
          .where(`${entity.getIdPropertyName()} = :id`, { id: id })
          .execute()

        if (!transaction)
          await queryRunner.commitTransaction()

        return <IResultTransaction>{
          ok: true,
          message: `Operation Removed Successful`,
          data: {
            [`${entity.getIdPropertyName()}`]: id
          }
        }
      } catch (error) {
        if (!transaction)
          await queryRunner.rollbackTransaction()

        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        }, HttpStatus.FORBIDDEN, {
          cause: error
        })
      } finally {
        if (!transaction)
          await queryRunner.release()
      }
    }
  }

  return TypeOrmBaseImplement
}