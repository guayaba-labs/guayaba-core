import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class PaginationQuery {

  @IsNumber()
  @IsPositive()
  @IsOptional()
  page: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit: number

  @IsString()
  @IsOptional()
  filters?: string
}