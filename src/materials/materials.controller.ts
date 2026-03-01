import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('materials')
export class MaterialsController {
    constructor(private materialsService: MaterialsService) {}

    @Get()
    findAll(@Query('all') all?: string) {
        return this.materialsService.findAll(all === 'true');
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateMaterialDto) {
        return this.materialsService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateMaterialDto) {
        return this.materialsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.materialsService.remove(id);
    }
}