import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class PaginationQuery {

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: true
  })
  page: number

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: true
  })
  limit: number

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false
  })
  filters?: string
}