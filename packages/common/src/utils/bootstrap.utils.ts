import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '../filters/http-exception.filter';

export function setupGlobalMiddleware(app: INestApplication) {
    // Register Global Exception Filter
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Register Global Validation Pipe
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));

    // Check if we need to enable CORS
    app.enableCors();
}
