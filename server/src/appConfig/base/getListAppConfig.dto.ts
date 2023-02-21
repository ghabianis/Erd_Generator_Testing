import { ApiProperty } from "@nestjs/swagger";
import { AppConfig } from "./AppConfig";
export class getListAppConfigDto {
  @ApiProperty({
    type: [AppConfig],
  })
  readonly paginatedResult!: [AppConfig];

  @ApiProperty({
    type: Number,
  })
  readonly totalCount!: number;
}
