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
exports.HeroSlidesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
let HeroSlidesService = class HeroSlidesService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
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
    extractS3Key(url) {
        const prefix = `${this.cdnUrl}/`;
        if (url.startsWith(prefix)) {
            return url.replace(prefix, '');
        }
        return null;
    }
    async deleteFromS3(key) {
        await this.s3.send(new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        }));
    }
    findAll(includeInactive = false) {
        return this.prisma.heroSlide.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findById(id) {
        const slide = await this.prisma.heroSlide.findUnique({ where: { id } });
        if (!slide)
            throw new common_1.NotFoundException('Slide not found');
        return slide;
    }
    create(dto) {
        return this.prisma.heroSlide.create({ data: dto });
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.heroSlide.update({ where: { id }, data: dto });
    }
    async remove(id) {
        const slide = await this.findById(id);
        if (slide.imageUrl) {
            const s3Key = this.extractS3Key(slide.imageUrl);
            if (s3Key) {
                await this.deleteFromS3(s3Key).catch(() => { });
            }
        }
        return this.prisma.heroSlide.delete({ where: { id } });
    }
};
exports.HeroSlidesService = HeroSlidesService;
exports.HeroSlidesService = HeroSlidesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], HeroSlidesService);
//# sourceMappingURL=hero-slides.service.js.map