import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Response<T> {
    statusCode: number;
    message: string;
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => ({
                statusCode: context.switchToHttp().getResponse().statusCode,
                message: 'Success',
                data,
            })),
            catchError((err) => {
                const status = err instanceof HttpException ? err.getStatus() : 500;
                return throwError(() => new HttpException({
                    statusCode: status,
                    message: err.message || 'Internal Server Error',
                    error: err.name || 'Error',
                }, status));
            }),
        );
    }
}
