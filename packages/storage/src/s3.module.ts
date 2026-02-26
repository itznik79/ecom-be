import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3StorageService } from './s3.service';
import { S3Client } from '@aws-sdk/client-s3';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: S3Client,
      useFactory: (config: ConfigService) => {
        const region = config.get<string>('AWS_REGION') || 'us-east-1';
        const endpoint = config.get<string>('S3_ENDPOINT') || undefined;
        const forcePathStyle = config.get<string>('S3_FORCE_PATH_STYLE') === 'true';
        const maxAttempts = Number(config.get<number>('AWS_SDK_MAX_ATTEMPTS') || 3);

        const credentials = config.get<string>('AWS_ACCESS_KEY_ID')
          ? {
              accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID')!,
              secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY')!,
            }
          : undefined;

        return new S3Client({ region, endpoint, forcePathStyle, credentials, maxAttempts });
      },
      inject: [ConfigService],
    },
    S3StorageService,
  ],
  exports: [S3StorageService],
})
export class S3Module {}
