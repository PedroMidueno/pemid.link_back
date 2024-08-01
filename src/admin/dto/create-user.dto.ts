import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

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

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_-])[A-Za-z\d@$!%*#?&_-]{8,}$/, {
    message: 'The password must have a lowercase, an uppercase, a number and a special character'
  })
  readonly password?: string
}
