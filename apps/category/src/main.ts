import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupGlobalMiddleware } from '@app/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    setupGlobalMiddleware(app);
    await app.listen(3003);
    console.log('Category Service running on port 3003');
}
bootstrap();
