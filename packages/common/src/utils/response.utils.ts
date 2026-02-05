import { HttpStatus } from '@nestjs/common';
import { PaginationMeta } from '../types/pagination.types';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    meta?: PaginationMeta;
    error?: any;
    statusCode: number;
    timestamp: string;
}

export class ApiBuilder<T> {
    private response: ApiResponse<T> = {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString()
    };

    public static success<T>(data: T, message: string = 'Success'): ApiBuilder<T> {
        const builder = new ApiBuilder<T>();
        builder.response.data = data;
        builder.response.message = message;
        return builder;
    }

    public static error(message: string = 'Error', error: any = null, statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR): ApiBuilder<null> {
        const builder = new ApiBuilder<null>();
        builder.response.success = false;
        builder.response.message = message;
        builder.response.error = error;
        builder.response.statusCode = statusCode;
        return builder;
    }

    public meta(meta: PaginationMeta): this {
        this.response.meta = meta;
        return this;
    }

    public status(statusCode: number): this {
        this.response.statusCode = statusCode;
        return this;
    }

    public build(): ApiResponse<T> {
        return this.response;
    }
}

export const createResponse = <T>(data: T, message = 'Success', statusCode = HttpStatus.OK) => {
    return ApiBuilder.success(data, message).status(statusCode).build();
};

export const createErrorResponse = (message = 'Error', error: any = null, statusCode = HttpStatus.INTERNAL_SERVER_ERROR) => {
    return ApiBuilder.error(message, error, statusCode).build();
};
