import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto';
export declare class HeroSlidesService {
    private prisma;
    private config;
    private s3;
    private bucket;
    private cdnUrl;
    constructor(prisma: PrismaService, config: ConfigService);
    private extractS3Key;
    private deleteFromS3;
    findAll(includeInactive?: boolean): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        buttonText: string | null;
        buttonLink: string | null;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        buttonText: string | null;
        buttonLink: string | null;
    }>;
    create(dto: CreateHeroSlideDto): import(".prisma/client").Prisma.Prisma__HeroSlideClient<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        buttonText: string | null;
        buttonLink: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateHeroSlideDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        buttonText: string | null;
        buttonLink: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        sortOrder: number;
        title: string;
        subtitle: string | null;
        buttonText: string | null;
        buttonLink: string | null;
    }>;
}
