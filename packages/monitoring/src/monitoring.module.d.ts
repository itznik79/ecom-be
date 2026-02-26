import { DynamicModule } from '@nestjs/common';
export declare class MonitoringModule {
    static forRoot(opts?: {
        sentry?: {
            dsn?: string;
            env?: string;
        };
        metrics?: boolean;
    }): DynamicModule;
}
