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
        slug: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    uploadHeroSlideImage(slideId: string, file: Express.Multer.File): Promise<{
        id: string;
        imageUrl: string | null;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        subtitle: string | null;
        buttonText: string | null;
        buttonLink: string | null;
    }>;
    uploadProductImage(productId: string, file: Express.Multer.File, isMain?: boolean, alt?: string): Promise<{
        id: string;
        sortOrder: number;
        createdAt: Date;
        s3Key: string;
        url: string;
        alt: string | null;
        isMain: boolean;
        productId: string;
    }>;
    uploadPortfolioImage(portfolioWorkId: string, file: Express.Multer.File, alt?: string): Promise<{
        id: string;
        sortOrder: number;
        createdAt: Date;
        s3Key: string;
        url: string;
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
        id: string;
        sortOrder: number;
        createdAt: Date;
        s3Key: string;
        url: string;
        alt: string | null;
        isMain: boolean;
        productId: string;
    }>;
    deletePortfolioImage(imageId: string): Promise<{
        id: string;
        sortOrder: number;
        createdAt: Date;
        s3Key: string;
        url: string;
        alt: string | null;
        portfolioWorkId: string;
    }>;
}
