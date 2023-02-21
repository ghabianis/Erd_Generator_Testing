import { ApiProperty } from "@nestjs/swagger";
import { User } from "./User";
export class getListUserDto {
  @ApiProperty({
    type: [User],
  })
  readonly paginatedResult!: [User];

  @ApiProperty({
    type: Number,
  })
  readonly totalCount!: number;
}
