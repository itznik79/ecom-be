"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MetricsModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsModule = exports.MetricsService = void 0;
exports.getRegistry = getRegistry;
exports.metricsMiddleware = metricsMiddleware;
const prom_client_1 = require("prom-client");
const common_1 = require("@nestjs/common");
const registry = new prom_client_1.Registry();
(0, prom_client_1.collectDefaultMetrics)({ register: registry });
const httpDuration = new prom_client_1.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status'],
    registers: [registry],
});
function getRegistry() {
    return registry;
}
function metricsMiddleware(req, res, next) {
    const end = httpDuration.startTimer();
    res.on('finish', () => {
        end({ method: req.method, route: req.route ? req.route.path : req.path, status: res.statusCode });
    });
    next();
}
let MetricsService = class MetricsService {
    constructor() {
        this.registry = registry;
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)()
], MetricsService);
let MetricsModule = MetricsModule_1 = class MetricsModule {
    static forRoot() {
        return { module: MetricsModule_1, providers: [MetricsService], exports: [MetricsService] };
    }
};
exports.MetricsModule = MetricsModule;
exports.MetricsModule = MetricsModule = MetricsModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({ providers: [MetricsService], exports: [MetricsService] })
], MetricsModule);
//# sourceMappingURL=metrics.js.map