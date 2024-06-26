import { ExecutionContext, NotFoundException, createParamDecorator } from '@nestjs/common'
import { User } from '../types'

export const GetUser = createParamDecorator((data: string | null | undefined, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  const user = req.user as User

  if (!user)
    throw new NotFoundException('user not found')

  return data ? user[data] : user
})
