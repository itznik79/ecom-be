import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Module({})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                createProxyMiddleware({
                    target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/auth': '',
                    },
                }),
            )
            .forRoutes('auth');

        consumer
            .apply(
                createProxyMiddleware({
                    target: process.env.USER_SERVICE_URL || 'http://localhost:3002',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/users': '',
                    },
                }),
            )
            .forRoutes('users');

        consumer
            .apply(
                createProxyMiddleware({
                    target: process.env.CATEGORY_SERVICE_URL || 'http://localhost:3003',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/categories': '',
                    },
                }),
            )
            .forRoutes('categories');

        consumer
            .apply(
                createProxyMiddleware({
                    target: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3004',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/products': '',
                    },
                }),
            )
            .forRoutes('products');
    }
}
