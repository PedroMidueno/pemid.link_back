import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginDto {
  @IsString()
  @IsEmail()
  readonly email: string

  @IsString()
  @MinLength(8)
  readonly password: string
}
