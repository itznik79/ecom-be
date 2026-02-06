import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBuilder } from '../utils/response.utils';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error: any = null;

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const responseBody = exception.getResponse();
            if (typeof responseBody === 'string') {
                message = responseBody;
            } else if (typeof responseBody === 'object' && responseBody !== null) {
                const body = responseBody as any;
                message = body.message || message;
                error = body.error || body;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            error = exception.stack;
        }

        const apiResponse = ApiBuilder.error(message, error, statusCode).build();

        response
            .status(statusCode)
            .json(apiResponse);
    }
}
