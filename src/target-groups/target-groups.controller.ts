import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TargetGroupsService } from './target-groups.service';
import { CreateTargetGroupDto } from './dto/create-target-group.dto';
import { UpdateTargetGroupDto } from './dto/update-target-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('target-groups')
export class TargetGroupsController {
    constructor(private targetGroupsService: TargetGroupsService) {}

    @Get()
    findAll(@Query('all') all?: string) {
        return this.targetGroupsService.findAll(all === 'true');
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateTargetGroupDto) {
        return this.targetGroupsService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTargetGroupDto) {
        return this.targetGroupsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.targetGroupsService.remove(id);
    }
}