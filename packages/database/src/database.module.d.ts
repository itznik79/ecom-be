import { OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
export declare class DatabaseModule implements OnModuleInit {
    private sequelize;
    constructor(sequelize: Sequelize);
    onModuleInit(): Promise<void>;
}
