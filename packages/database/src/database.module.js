"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const migrations_1 = require("./migrations");
const entities_1 = require("./entities");
let DatabaseModule = class DatabaseModule {
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    async onModuleInit() {
        try {
            await this.sequelize.authenticate();
            console.log('✓ Database connection established');
            // Run migrations
            if (process.env.RUN_MIGRATIONS !== 'false') {
                await (0, migrations_1.runMigrations)(this.sequelize);
            }
        }
        catch (error) {
            console.error('✗ Database connection failed:', error);
        }
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forRootAsync({
                useFactory: () => ({
                    dialect: 'postgres',
                    host: process.env.DB_HOST || 'localhost',
                    port: parseInt(process.env.DB_PORT || '5432'),
                    username: process.env.DB_USER || 'postgres',
                    password: process.env.DB_PASSWORD || 'password',
                    database: process.env.DB_NAME || 'ecommerce',
                    models: [entities_1.User, entities_1.Category, entities_1.AuthSession],
                    autoLoadModels: true,
                    synchronize: process.env.NODE_ENV === 'development',
                    logging: process.env.NODE_ENV === 'development' ? console.log : false,
                    timezone: '+00:00',
                    dialectOptions: {
                        useUTC: true,
                    },
                }),
            }),
            sequelize_1.SequelizeModule.forFeature([entities_1.User, entities_1.Category, entities_1.AuthSession]),
        ],
        exports: [sequelize_1.SequelizeModule],
    }),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize])
], DatabaseModule);
//# sourceMappingURL=database.module.js.map