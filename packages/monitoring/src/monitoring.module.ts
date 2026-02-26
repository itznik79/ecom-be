import { Module, Global, DynamicModule } from '@nestjs/common';
import { SentryModule } from './sentry';
import { MetricsModule } from './metrics';

@Global()
@Module({})
export class MonitoringModule {
  static forRoot(opts: { sentry?: { dsn?: string; env?: string }; metrics?: boolean } = {}): DynamicModule {
    const imports = [];
    if (opts.sentry) imports.push(SentryModule.forRoot(opts.sentry));
    if (opts.metrics) imports.push(MetricsModule.forRoot());
    return { module: MonitoringModule, imports, exports: imports };
  }
}
