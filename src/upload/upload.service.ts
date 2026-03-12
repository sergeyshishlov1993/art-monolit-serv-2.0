import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';
import * as sharp from 'sharp';
import * as path from 'path';

@Injectable()
export class UploadService implements OnModuleInit {
    private s3: S3Client;
    private bucket: string;
    private cdnUrl: string;
    private watermarkBuffer: Buffer;

    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
    ) {
        this.bucket = this.config.get<string>('S3_BUCKET')!;
        this.cdnUrl = this.config.get<string>('S3_CDN_URL')!;

        this.s3 = new S3Client({
            region: this.config.get<string>('S3_REGION')!,
            credentials: {
                accessKeyId: this.config.get<string>('S3_ACCESS_KEY')!,
                secretAccessKey: this.config.get<string>('S3_SECRET_KEY')!,
            },
        });
    }

    async onModuleInit() {
        const watermarkPath = path.join(process.cwd(), 'assets', 'watermark.png');
        this.watermarkBuffer = await sharp(watermarkPath)
            .resize(300)
            .png()
            .toBuffer();
    }

    private async convertToWebp(
        buffer: Buffer,
        options?: {
            width?: number;
            height?: number;
            quality?: number;
            watermark?: boolean;
        }
    ): Promise<Buffer> {
        let sharpInstance = sharp(buffer);

        if (options?.width || options?.height) {
            sharpInstance = sharpInstance.resize(options.width, options.height, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }

        if (options?.watermark && this.watermarkBuffer) {
            sharpInstance = sharpInstance.composite([{
                input: this.watermarkBuffer,
                gravity: 'southeast',
                blend: 'over',
            }]);
        }

        return sharpInstance
            .webp({ quality: options?.quality || 85 })
            .toBuffer();
    }

    private async uploadToS3(key: string, buffer: Buffer, contentType: string): Promise<string> {
        await this.s3.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        }));

        return `${this.cdnUrl}/${key}`;
    }

    private async deleteFromS3(key: string): Promise<void> {
        await this.s3.send(new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        }));
    }

    private extractS3Key(url: string): string | null {
        const prefix = `${this.cdnUrl}/`;
        if (url.startsWith(prefix)) {
            return url.replace(prefix, '');
        }
        return null;
    }

    async uploadCategoryImage(categoryId: string, file: Express.Multer.File) {
        const webpBuffer = await this.convertToWebp(file.buffer, { width: 800, quality: 85 });
        const s3Key = `categories/${categoryId}/${randomUUID()}.webp`;
        const url = await this.uploadToS3(s3Key, webpBuffer, 'image/webp');

        const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
        if (category?.imageUrl) {
            const oldKey = this.extractS3Key(category.imageUrl);
            if (oldKey) {
                await this.deleteFromS3(oldKey).catch(() => {});
            }
        }

        return this.prisma.category.update({
            where: { id: categoryId },
            data: { imageUrl: url },
        });
    }

    async uploadHeroSlideImage(slideId: string, file: Express.Multer.File) {
        const webpBuffer = await this.convertToWebp(file.buffer, { width: 1920, quality: 90 });
        const s3Key = `hero-slides/${slideId}/${randomUUID()}.webp`;
        const url = await this.uploadToS3(s3Key, webpBuffer, 'image/webp');

        const slide = await this.prisma.heroSlide.findUnique({ where: { id: slideId } });
        if (slide?.imageUrl) {
            const oldKey = this.extractS3Key(slide.imageUrl);
            if (oldKey) {
                await this.deleteFromS3(oldKey).catch(() => {});
            }
        }

        return this.prisma.heroSlide.update({
            where: { id: slideId },
            data: { imageUrl: url },
        });
    }

    async uploadProductImage(productId: string, file: Express.Multer.File, isMain = false, alt?: string) {
        const webpBuffer = await this.convertToWebp(file.buffer, { width: 1200, quality: 85, watermark: true });
        const s3Key = `products/${productId}/${randomUUID()}.webp`;
        const url = await this.uploadToS3(s3Key, webpBuffer, 'image/webp');

        if (isMain) {
            await this.prisma.productImage.updateMany({
                where: { productId, isMain: true },
                data: { isMain: false },
            });
        }

        return this.prisma.productImage.create({
            data: { productId, s3Key, url, isMain, alt },
        });
    }

    async uploadPortfolioImage(portfolioWorkId: string, file: Express.Multer.File, alt?: string) {
        const webpBuffer = await this.convertToWebp(file.buffer, { width: 1200, quality: 85, watermark: true });
        const s3Key = `portfolio/${portfolioWorkId}/${randomUUID()}.webp`;
        const url = await this.uploadToS3(s3Key, webpBuffer, 'image/webp');

        return this.prisma.portfolioImage.create({
            data: { portfolioWorkId, s3Key, url, alt },
        });
    }

    async bulkUploadPortfolio(
        files: Express.Multer.File[],
        categoryId: string,
        targetGroupIds: string[],
        materialIds: string[],
    ) {
        const results = [];

        for (const file of files) {
            const work = await this.prisma.portfolioWork.create({
                data: {
                    categoryId,
                    isActive: true,
                    sortOrder: 0,
                    ...(targetGroupIds.length && {
                        targetGroups: { connect: targetGroupIds.map((id) => ({ id })) },
                    }),
                    ...(materialIds.length && {
                        materials: { connect: materialIds.map((id) => ({ id })) },
                    }),
                },
            });

            const webpBuffer = await this.convertToWebp(file.buffer, { width: 1200, quality: 85, watermark: true });
            const s3Key = `portfolio/${work.id}/${randomUUID()}.webp`;
            const url = await this.uploadToS3(s3Key, webpBuffer, 'image/webp');

            await this.prisma.portfolioImage.create({
                data: { portfolioWorkId: work.id, s3Key, url, sortOrder: 0 },
            });

            results.push({
                id: work.id,
                imageUrl: url,
            });
        }

        return { created: results.length, works: results };
    }

    async deleteProductImage(imageId: string) {
        const image = await this.prisma.productImage.findUniqueOrThrow({ where: { id: imageId } });

        await this.deleteFromS3(image.s3Key).catch(() => {});

        return this.prisma.productImage.delete({ where: { id: imageId } });
    }

    async deletePortfolioImage(imageId: string) {
        const image = await this.prisma.portfolioImage.findUniqueOrThrow({ where: { id: imageId } });

        await this.deleteFromS3(image.s3Key).catch(() => {});

        return this.prisma.portfolioImage.delete({ where: { id: imageId } });
    }
}