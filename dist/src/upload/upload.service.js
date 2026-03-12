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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
const sharp = require("sharp");
const path = require("path");
let UploadService = class UploadService {
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
        this.bucket = this.config.get('S3_BUCKET');
        this.cdnUrl = this.config.get('S3_CDN_URL');
        this.s3 = new client_s3_1.S3Client({
            region: this.config.get('S3_REGION'),
            credentials: {
                accessKeyId: this.config.get('S3_ACCESS_KEY'),
                secretAccessKey: this.config.get('S3_SECRET_KEY'),
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
    async convertToWebp(buffer, options) {
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
    async uploadToS3(key, buffer, contentType) {
        await this.s3.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        }));
        return `${this.cdnUrl}/${key}`;
    }
    async deleteFromS3(key) {
        await this.s3.send(new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        }));
    }
    extractS3Key(url) {
        const prefix = `${this.cdnUrl}/`;
        if (url.startsWith(prefix)) {
            return url.replace(prefix, '');
        }
        return null;
    }
    async uploadCategoryImage(categoryId, file) {
        const webpBuffer = await this.convertToWebp(file.buffer, { width: 800, quality: 85 });
        const s3Key = `categories/${categoryId}/${(0, crypto_1.randomUUID)()}.webp`;
        const url = await this.uploadToS3(s3Key, webpBuffer, 'image/webp');
        const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
        if (category?.imageUrl) {
            const oldKey = this.extractS3Key(category.imageUrl);
            if (oldKey) {
                await this.deleteFromS3(oldKey).catch(() => { });
            }
        }
        return this.prisma.category.update({
            where: { id: categoryId },
            data: { imageUrl: url },
        });
    }
    async uploadHeroSlideImage(slideId, file) {
        const webpBuffer = await this.convertToWebp(file.buffer, { width: 1920, quality: 90 });
        const s3Key = `hero-slides/${slideId}/${(0, crypto_1.randomUUID)()}.webp`;
        const url = await this.uploadToS3(s3Key, webpBuffer, 'image/webp');
        const slide = await this.prisma.heroSlide.findUnique({ where: { id: slideId } });
        if (slide?.imageUrl) {
            const oldKey = this.extractS3Key(slide.imageUrl);
            if (oldKey) {
                await this.deleteFromS3(oldKey).catch(() => { });
            }
        }
        return this.prisma.heroSlide.update({
            where: { id: slideId },
            data: { imageUrl: url },
        });
    }
    async uploadProductImage(productId, file, isMain = false, alt) {
        const webpBuffer = await this.convertToWebp(file.buffer, { width: 1200, quality: 85, watermark: true });
        const s3Key = `products/${productId}/${(0, crypto_1.randomUUID)()}.webp`;
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
    async uploadPortfolioImage(portfolioWorkId, file, alt) {
        const webpBuffer = await this.convertToWebp(file.buffer, { width: 1200, quality: 85, watermark: true });
        const s3Key = `portfolio/${portfolioWorkId}/${(0, crypto_1.randomUUID)()}.webp`;
        const url = await this.uploadToS3(s3Key, webpBuffer, 'image/webp');
        return this.prisma.portfolioImage.create({
            data: { portfolioWorkId, s3Key, url, alt },
        });
    }
    async bulkUploadPortfolio(files, categoryId, targetGroupIds, materialIds) {
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
            const s3Key = `portfolio/${work.id}/${(0, crypto_1.randomUUID)()}.webp`;
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
    async deleteProductImage(imageId) {
        const image = await this.prisma.productImage.findUniqueOrThrow({ where: { id: imageId } });
        await this.deleteFromS3(image.s3Key).catch(() => { });
        return this.prisma.productImage.delete({ where: { id: imageId } });
    }
    async deletePortfolioImage(imageId) {
        const image = await this.prisma.portfolioImage.findUniqueOrThrow({ where: { id: imageId } });
        await this.deleteFromS3(image.s3Key).catch(() => { });
        return this.prisma.portfolioImage.delete({ where: { id: imageId } });
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], UploadService);
//# sourceMappingURL=upload.service.js.map