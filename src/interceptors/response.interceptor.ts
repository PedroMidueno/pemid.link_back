import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

interface Response<T> {
  data: T
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const httpContext = context.switchToHttp()
    const response = httpContext.getResponse()

    return next
      .handle()
      .pipe(
        map(data => ({
          success: true,
          statusCode: response.statusCode,
          data
        }))
      )
  }
}
