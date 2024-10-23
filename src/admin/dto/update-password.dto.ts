import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator'

export class UpdatePasswordDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly oldPassword?: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_-])[A-Za-z\d@$!%*#?&_-]{8,}$/, {
    message: 'The password must have a lowercase, an uppercase, a number and a special character'
  })
  readonly newPassword: string
}
