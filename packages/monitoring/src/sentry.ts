import * as Sentry from '@sentry/node';
import { Injectable, Module, Global } from '@nestjs/common';

let initialized = false;

export function initSentry(opts: { dsn?: string; env?: string; release?: string } = {}) {
  if (initialized) return;
  if (!opts.dsn) return;
  Sentry.init({
    dsn: opts.dsn,
    environment: opts.env,
    release: opts.release,
  });
  initialized = true;
}

@Injectable()
export class SentryService {
  captureException(err: any) {
    Sentry.captureException(err);
  }
}

@Global()
@Module({ providers: [SentryService], exports: [SentryService] })
export class SentryModule {
  static forRoot(opts: { dsn?: string; env?: string; release?: string } = {}) {
    initSentry(opts);
    return {
      module: SentryModule,
      providers: [SentryService],
      exports: [SentryService],
    };
  }
}
