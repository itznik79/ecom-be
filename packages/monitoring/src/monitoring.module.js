"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MonitoringModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringModule = void 0;
const common_1 = require("@nestjs/common");
const sentry_1 = require("./sentry");
const metrics_1 = require("./metrics");
let MonitoringModule = MonitoringModule_1 = class MonitoringModule {
    static forRoot(opts = {}) {
        const imports = [];
        if (opts.sentry)
            imports.push(sentry_1.SentryModule.forRoot(opts.sentry));
        if (opts.metrics)
            imports.push(metrics_1.MetricsModule.forRoot());
        return { module: MonitoringModule_1, imports, exports: imports };
    }
};
exports.MonitoringModule = MonitoringModule;
exports.MonitoringModule = MonitoringModule = MonitoringModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], MonitoringModule);
//# sourceMappingURL=monitoring.module.js.map