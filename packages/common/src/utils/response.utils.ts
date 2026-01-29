import { HttpStatus } from '@nestjs/common';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
    statusCode: number;
}

export const createResponse = <T>(
    data: T,
    message: string = 'Success',
    statusCode: number = HttpStatus.OK,
): ApiResponse<T> => {
    return {
        success: true,
        message,
        data,
        statusCode,
    };
};

export const createErrorResponse = (
    message: string = 'Error',
    error: any = null,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
): ApiResponse => {
    return {
        success: false,
        message,
        error,
        statusCode,
    };
};
