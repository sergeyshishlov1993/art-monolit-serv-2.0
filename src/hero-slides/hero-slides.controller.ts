import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { HeroSlidesService } from './hero-slides.service';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('hero-slides')
export class HeroSlidesController {
    constructor(private heroSlidesService: HeroSlidesService) {}

    @Get()
    findAll(@Query('all') all?: string) {
        return this.heroSlidesService.findAll(all === 'true');
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.heroSlidesService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateHeroSlideDto) {
        return this.heroSlidesService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateHeroSlideDto) {
        return this.heroSlidesService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.heroSlidesService.remove(id);
    }
}