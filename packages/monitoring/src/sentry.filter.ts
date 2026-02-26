// Sentry exception filter stub - implement capture logic later
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class SentryFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // TODO: capture exception with Sentry
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(500).send({ error: 'Internal Server Error' });
  }
}
