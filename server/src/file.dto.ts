import { ApiProperty } from "@nestjs/swagger";

export class fileDto {

  @ApiProperty({
    type: String,
  })
  readonly file!: number;
}
