import { QueryRunner } from "typeorm"
import { BaseInputDto } from "../../dto/base.dto"
import { IResultTransaction } from "../../responses/generic-response.response"

export interface IWriter<I> {

  /**
   *
   * @param attrs
   * @param transaction
   */
  create(attrs: BaseInputDto, transaction?: QueryRunner): Promise<IResultTransaction>

  /**
   *
   * @param id
   * @param attrs
   * @param transaction
   */
  update(id: number, attrs: BaseInputDto, transaction?: QueryRunner): Promise<IResultTransaction>

  /**
   *
   * @param id
   * @param transaction
   */
  remove(id: number, transaction?: QueryRunner): Promise<IResultTransaction>
}