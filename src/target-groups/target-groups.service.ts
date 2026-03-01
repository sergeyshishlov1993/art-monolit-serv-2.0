import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTargetGroupDto } from './dto/create-target-group.dto';
import { UpdateTargetGroupDto } from './dto/update-target-group.dto';

@Injectable()
export class TargetGroupsService {
    constructor(private prisma: PrismaService) {}

    findAll(includeInactive = false) {
        return this.prisma.targetGroup.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }

    create(dto: CreateTargetGroupDto) {
        return this.prisma.targetGroup.create({ data: dto });
    }

    async update(id: string, dto: UpdateTargetGroupDto) {
        await this.findById(id);
        return this.prisma.targetGroup.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        await this.findById(id);
        return this.prisma.targetGroup.delete({ where: { id } });
    }

    private async findById(id: string) {
        const group = await this.prisma.targetGroup.findUnique({ where: { id } });
        if (!group) throw new NotFoundException('Target group not found');
        return group;
    }
}