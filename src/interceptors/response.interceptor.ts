import { Injectable, NestInterceptor, CallHandler, ExecutionContext, Logger, HttpException } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

interface Response<T> {
  data: T
  statusCode: string
  success: boolean
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const httpContext = context.switchToHttp()
    const response = httpContext.getResponse()
    const logger = new Logger('Response Interceptor')

    return next
      .handle()
      .pipe(
        catchError(error => {
          logger.error(error?.name ?? error)
          console.error(error)

          if (error instanceof HttpException) {
            const statusCode = error.getStatus()
            const errorResponse = error.getResponse() as Record<string, string | number> | string

            response.status(statusCode).json({
              success: false,
              statusCode,
              data: null,
              message: typeof errorResponse === 'object' ? errorResponse.message : error.message,
              esMessage: error.cause || null
            })
          } else if ('statusCode' in error || 'status' in error && 'message' in error) {
            response.status(error?.statusCode || error?.status).json({
              success: false,
              statusCode: error?.statusCode || error?.status,
              data: null,
              message: error.message
            })
          }

          return throwError(() => error)
        }),
        map(data => ({
          success: true,
          statusCode: response.statusCode,
          data: data ? data : null
        }))
      )
  }
}
