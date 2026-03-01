import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
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
        return this.prisma.category.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { sortOrder: 'asc' },
            include: { _count: { select: { products: true } } },
        });
    }

    async findBySlug(slug: string) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                products: {
                    where: { isActive: true },
                    include: {
                        images: { where: { isMain: true }, take: 1 },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }

    create(dto: CreateCategoryDto) {
        return this.prisma.category.create({ data: dto });
    }

    async update(id: string, dto: UpdateCategoryDto) {
        await this.findById(id);
        return this.prisma.category.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        const category = await this.findById(id);

        if (category.imageUrl) {
            const s3Key = this.extractS3Key(category.imageUrl);
            if (s3Key) {
                await this.deleteFromS3(s3Key).catch(() => {});
            }
        }

        return this.prisma.category.delete({ where: { id } });
    }

    private async findById(id: string) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }
}