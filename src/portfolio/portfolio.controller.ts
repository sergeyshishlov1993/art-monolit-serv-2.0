import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('portfolio')
export class PortfolioController {
    constructor(private portfolioService: PortfolioService) {}

    @Get('counts')
    getCounts(@Query('categoryId') categoryId?: string) {
        return this.portfolioService.getCounts({ categoryId });
    }

    @Get()
    findAll(
        @Query('categoryId') categoryId?: string,
        @Query('targetGroup') targetGroupSlug?: string,
        @Query('material') materialSlug?: string,
        @Query('all') all?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.portfolioService.findAll({
            categoryId,
            targetGroupSlug,
            materialSlug,
            all: all === 'true',
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 12,
        });
    }

    @Get(':id')
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.portfolioService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreatePortfolioDto) {
        return this.portfolioService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePortfolioDto) {
        return this.portfolioService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.portfolioService.remove(id);
    }
}