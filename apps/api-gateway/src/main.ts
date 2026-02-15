import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for frontend
    app.enableCors({
        origin: true, // In production, replace with specific domain
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });

    // Handle cookies for JWT
    app.use(cookieParser());

    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 API Gateway running on http://localhost:${port}`);
}
bootstrap();
