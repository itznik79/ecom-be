export declare function initSentry(opts?: {
    dsn?: string;
    env?: string;
    release?: string;
}): void;
export declare class SentryService {
    captureException(err: any): void;
}
export declare class SentryModule {
    static forRoot(opts?: {
        dsn?: string;
        env?: string;
        release?: string;
    }): {
        module: typeof SentryModule;
        providers: (typeof SentryService)[];
        exports: (typeof SentryService)[];
    };
}
