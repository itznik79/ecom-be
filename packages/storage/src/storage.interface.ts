export interface IStorageProvider {
  upload(file: Buffer, key: string, mimeType: string): Promise<string>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expires?: number): Promise<string>;
  getPresignedUploadUrl(key: string, expires?: number, contentType?: string): Promise<{ url: string; key: string }>;
}
