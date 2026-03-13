import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class UploadService implements OnModuleInit {
    private config;
    private prisma;
    private s3;
    private bucket;
    private cdnUrl;
    private watermarkBuffer;
    constructor(config: ConfigService, prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private convertToWebp;
    private uploadToS3;
    private deleteFromS3;
    private extractS3Key;
    uploadCategoryImage(categoryId: string, file: Express.Multer.File): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
    }>;
    uploadHeroSlideImage(slideId: string, file: Express.Multer.File): Promise<{
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
    uploadProductImage(productId: string, file: Express.Multer.File, isMain?: boolean, alt?: string): Promise<{
        url: string;
        productId: string;
        id: string;
        createdAt: Date;
        sortOrder: number;
        isMain: boolean;
        s3Key: string;
        alt: string | null;
    }>;
    uploadPortfolioImage(portfolioWorkId: string, file: Express.Multer.File, alt?: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        sortOrder: number;
        s3Key: string;
        alt: string | null;
        portfolioWorkId: string;
    }>;
    bulkUploadPortfolio(files: Express.Multer.File[], categoryId: string, targetGroupIds: string[], materialIds: string[]): Promise<{
        created: number;
        works: {
            id: string;
            imageUrl: string;
        }[];
    }>;
    deleteProductImage(imageId: string): Promise<{
        url: string;
        productId: string;
        id: string;
        createdAt: Date;
        sortOrder: number;
        isMain: boolean;
        s3Key: string;
        alt: string | null;
    }>;
    deletePortfolioImage(imageId: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        sortOrder: number;
        s3Key: string;
        alt: string | null;
        portfolioWorkId: string;
    }>;
}
