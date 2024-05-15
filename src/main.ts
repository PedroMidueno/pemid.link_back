import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'
import { ResponseInterceptor } from './interceptors/response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api_v1')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  app.useGlobalInterceptors(new ResponseInterceptor())

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
