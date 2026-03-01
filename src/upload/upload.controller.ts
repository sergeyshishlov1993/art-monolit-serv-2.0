import { Controller, Post, Delete, Param, Body, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
    constructor(private uploadService: UploadService) {}

    @Post('categories/:categoryId')
    @UseInterceptors(FileInterceptor('file'))
    uploadCategoryImage(
        @Param('categoryId') categoryId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.uploadService.uploadCategoryImage(categoryId, file);
    }

    @Post('hero-slides/:slideId')
    @UseInterceptors(FileInterceptor('file'))
    uploadHeroSlideImage(
        @Param('slideId') slideId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.uploadService.uploadHeroSlideImage(slideId, file);
    }

    @Post('products/:productId')
    @UseInterceptors(FileInterceptor('file'))
    uploadProductImage(
        @Param('productId') productId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body('isMain') isMain?: string,
        @Body('alt') alt?: string,
    ) {
        return this.uploadService.uploadProductImage(productId, file, isMain === 'true', alt);
    }

    @Post('portfolio/:portfolioWorkId')
    @UseInterceptors(FileInterceptor('file'))
    uploadPortfolioImage(
        @Param('portfolioWorkId') portfolioWorkId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body('alt') alt?: string,
    ) {
        return this.uploadService.uploadPortfolioImage(portfolioWorkId, file, alt);
    }

    @Post('portfolio-bulk')
    @UseInterceptors(FilesInterceptor('files', 50))
    bulkUploadPortfolio(
        @UploadedFiles() files: Express.Multer.File[],
        @Body('categoryId') categoryId: string,
        @Body('targetGroupIds') targetGroupIds?: string,
        @Body('materialIds') materialIds?: string,
    ) {
        const parsedTargetGroups = targetGroupIds ? JSON.parse(targetGroupIds) : [];
        const parsedMaterials = materialIds ? JSON.parse(materialIds) : [];
        return this.uploadService.bulkUploadPortfolio(files, categoryId, parsedTargetGroups, parsedMaterials);
    }

    @Delete('products/images/:imageId')
    deleteProductImage(@Param('imageId') imageId: string) {
        return this.uploadService.deleteProductImage(imageId);
    }

    @Delete('portfolio/images/:imageId')
    deletePortfolioImage(@Param('imageId') imageId: string) {
        return this.uploadService.deletePortfolioImage(imageId);
    }
}