import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialsService {
    constructor(private prisma: PrismaService) {}

    findAll(includeInactive = false) {
        return this.prisma.material.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }

    create(dto: CreateMaterialDto) {
        return this.prisma.material.create({ data: dto });
    }

    async update(id: string, dto: UpdateMaterialDto) {
        await this.findById(id);
        return this.prisma.material.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        await this.findById(id);
        return this.prisma.material.delete({ where: { id } });
    }

    private async findById(id: string) {
        const material = await this.prisma.material.findUnique({ where: { id } });
        if (!material) throw new NotFoundException('Material not found');
        return material;
    }
}