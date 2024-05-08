import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

export class ShortenUrlDto {

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  readonly longUrl: string

  @IsOptional()
  @IsString()
  readonly customCode?: string
}
