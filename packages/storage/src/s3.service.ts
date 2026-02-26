import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import { IStorageProvider } from './storage.interface';
import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const MULTIPART_THRESHOLD = 5 * 1024 * 1024; // 5MB

@Injectable()
export class S3StorageService implements IStorageProvider {
  private readonly logger = new Logger(S3StorageService.name);

  constructor(private readonly s3Client: S3Client, private readonly config: ConfigService) {}

  private getBucket() {
    const bucket = this.config.get<string>('AWS_BUCKET');
    if (!bucket) throw new Error('AWS_BUCKET is not defined in config');
    return bucket;
  }

  async upload(file: Buffer, key: string, mimeType: string) {
    const bucket = this.getBucket();
    try {
      if (file.length > MULTIPART_THRESHOLD) {
        const parallelUploads3 = new Upload({
          client: this.s3Client,
          params: {
            Bucket: bucket,
            Key: key,
            Body: file,
            ContentType: mimeType,
            // Server-side encryption can be enforced here if desired
          },
        });
        await parallelUploads3.done();
      } else {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: file,
            ContentType: mimeType,
          }),
        );
      }
      this.logger.log(`upload: ${bucket}/${key}`);
      return key;
    } catch (err) {
      this.logger.error('upload failed', err as any);
      throw err;
    }
  }

  async delete(key: string) {
    const bucket = this.getBucket();
    await this.s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    this.logger.log(`delete: ${bucket}/${key}`);
  }

  async getSignedUrl(key: string, expires = 3600) {
    const bucket = this.getBucket();
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(this.s3Client, command, { expiresIn: expires });
  }

  async getPresignedUploadUrl(key: string, expires = 300, contentType?: string) {
    const bucket = this.getBucket();
    const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
    const url = await getSignedUrl(this.s3Client, cmd, { expiresIn: expires });
    return { url, key };
  }
}
