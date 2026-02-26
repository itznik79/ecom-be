// Metrics controller stub - expose /metrics endpoint later
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { getRegistry } from './metrics';

@Controller('metrics')
export class MetricsController {
  @Get()
  async getMetrics(@Res() res: Response) {
    const registry = getRegistry();
    res.setHeader('Content-Type', registry.contentType || 'text/plain; version=0.0.4');
    const metrics = await registry.metrics();
    res.send(metrics);
  }
}
