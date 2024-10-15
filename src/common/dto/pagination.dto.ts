import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

/* DO NOT use this directly, instead create a new DTO that extends this one */
export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  readonly page: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  readonly rowsPerPage: number

  @IsOptional()
  @IsString()
  readonly q: string
}
