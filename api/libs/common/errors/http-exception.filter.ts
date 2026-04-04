import type { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

export interface ErrorResponse {
  readonly success: false;
  readonly error: {
    readonly statusCode: number;
    readonly message: string | string[];
  };
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      typeof exceptionResponse === 'object' && 'message' in exceptionResponse
        ? (exceptionResponse as Record<string, unknown>).message
        : exception.message;

    const body: ErrorResponse = {
      success: false,
      error: {
        statusCode: status,
        message: message as string | string[],
      },
    };

    response.status(status).json(body);
  }
}
