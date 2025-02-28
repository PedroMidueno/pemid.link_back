import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  readonly firstName: string

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  readonly lastName: string

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(1)
  readonly email: string
}
