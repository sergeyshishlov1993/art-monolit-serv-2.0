import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto';

@Injectable()
export class HeroSlidesService {
    private s3: S3Client;
    private bucket: string;
    private cdnUrl: string;

    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
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

    private extractS3Key(url: string): string | null {
        const prefix = `${this.cdnUrl}/`;
        if (url.startsWith(prefix)) {
            return url.replace(prefix, '');
        }
        return null;
    }

    private async deleteFromS3(key: string): Promise<void> {
        await this.s3.send(new DeleteObjectCommand({
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

    async findById(id: string) {
        const slide = await this.prisma.heroSlide.findUnique({ where: { id } });
        if (!slide) throw new NotFoundException('Slide not found');
        return slide;
    }

    create(dto: CreateHeroSlideDto) {
        return this.prisma.heroSlide.create({ data: dto });
    }

    async update(id: string, dto: UpdateHeroSlideDto) {
        await this.findById(id);
        return this.prisma.heroSlide.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        const slide = await this.findById(id);

        if (slide.imageUrl) {
            const s3Key = this.extractS3Key(slide.imageUrl);
            if (s3Key) {
                await this.deleteFromS3(s3Key).catch(() => {});
            }
        }

        return this.prisma.heroSlide.delete({ where: { id } });
    }
}