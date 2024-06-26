import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly oldPassword: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly newPassword: string
}
