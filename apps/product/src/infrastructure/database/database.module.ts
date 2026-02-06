import { Module } from '@nestjs/common';
import { DatabaseModule as SharedDatabaseModule } from '@app/database';

@Module({
    imports: [SharedDatabaseModule],
    exports: [SharedDatabaseModule],
})
export class DatabaseModule { }
