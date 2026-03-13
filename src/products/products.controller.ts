import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get('counts')
    getCounts(
        @Query('categoryId') categoryId?: string,
        @Query('targetGroup') targetGroupSlug?: string,
        @Query('material') materialSlug?: string,
        @Query('badge') badge?: string,
    ) {
        return this.productsService.getCounts({
            categoryId,
            targetGroupSlug,
            materialSlug,
            badge,
        });
    }

    @Get()
    findAll(
        @Query('categoryId') categoryId?: string,
        @Query('targetGroup') targetGroupSlug?: string,
        @Query('material') materialSlug?: string,
        @Query('badge') badge?: string,
        @Query('all') all?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.productsService.findAll({
            categoryId,
            targetGroupSlug,
            materialSlug,
            badge,
            all: all === 'true',
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 12,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateProductDto) {
        return this.productsService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/specs')
    addSpec(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateSpecDto) {
        return this.productsService.addSpec(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('specs/:specId')
    updateSpec(@Param('specId', ParseUUIDPipe) specId: string, @Body() dto: UpdateSpecDto) {
        return this.productsService.updateSpec(specId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('specs/:specId')
    removeSpec(@Param('specId', ParseUUIDPipe) specId: string) {
        return this.productsService.removeSpec(specId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/main-image/:imageId')
    setMainImage(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('imageId', ParseUUIDPipe) imageId: string,
    ) {
        return this.productsService.setMainImage(id, imageId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
        return this.productsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.remove(id);
    }

    @Get('by-id/:id')
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.findById(id);
    }

    @Get(':slug')
    findBySlug(@Param('slug') slug: string) {
        return this.productsService.findBySlug(slug);
    }
}