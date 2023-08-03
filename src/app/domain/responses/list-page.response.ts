import { ApiProperty } from "@nestjs/swagger"

export class ListPageResponse {

  @ApiProperty({
    type: Number,
    required: true
  })
  page: number

  @ApiProperty({
    type: Number,
    required: true
  })
  limit: number

  filters: any[]

  items: any[]
}