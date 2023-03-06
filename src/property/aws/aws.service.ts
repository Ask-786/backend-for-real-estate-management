import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';

@Injectable()
export class AwsService {
  bucketName = process.env.AWS_BUCKET_NAME;
  region = process.env.AWS_REGION;
  s3Client: S3Client;
  command: PutObjectCommand;

  constructor() {
    this.s3Client = new S3Client({
      region: this.region,
    });
    this.command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: crypto.randomBytes(16).toString('hex'),
    });
  }

  async generateUplaodUrl() {
    const uploadUrl = await getSignedUrl(this.s3Client, this.command, {
      expiresIn: 60,
    });
    return { uploadUrl };
  }

  getS3UploadUrl() {
    return this.generateUplaodUrl();
  }
}
