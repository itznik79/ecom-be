import { Registry } from 'prom-client';
export declare function getRegistry(): Registry;
export declare function metricsMiddleware(req: any, res: any, next: any): void;
export declare class MetricsService {
    registry: Registry;
}
export declare class MetricsModule {
    static forRoot(): {
        module: typeof MetricsModule;
        providers: (typeof MetricsService)[];
        exports: (typeof MetricsService)[];
    };
}
