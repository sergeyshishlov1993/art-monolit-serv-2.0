import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('leads')
export class LeadsController {
    constructor(private leadsService: LeadsService) {}

    @Post()
    create(@Body() dto: CreateLeadDto) {
        return this.leadsService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('status') status?: string, @Query('source') source?: string) {
        return this.leadsService.findAll({ status, source });
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.leadsService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
        return this.leadsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.leadsService.remove(id);
    }
}