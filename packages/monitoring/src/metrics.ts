import { Registry, collectDefaultMetrics, Histogram } from 'prom-client';
import { Injectable, Module, Global } from '@nestjs/common';

const registry = new Registry();
collectDefaultMetrics({ register: registry });

const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  registers: [registry],
});

export function getRegistry(): Registry {
  return registry;
}

export function metricsMiddleware(req: any, res: any, next: any) {
  const end = httpDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route ? req.route.path : req.path, status: res.statusCode });
  });
  next();
}

@Injectable()
export class MetricsService {
  registry = registry;
}

@Global()
@Module({ providers: [MetricsService], exports: [MetricsService] })
export class MetricsModule {
  static forRoot() {
    return { module: MetricsModule, providers: [MetricsService], exports: [MetricsService] };
  }
}
