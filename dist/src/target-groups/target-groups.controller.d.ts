import { TargetGroupsService } from './target-groups.service';
import { CreateTargetGroupDto } from './dto/create-target-group.dto';
import { UpdateTargetGroupDto } from './dto/update-target-group.dto';
export declare class TargetGroupsController {
    private targetGroupsService;
    constructor(targetGroupsService: TargetGroupsService);
    findAll(all?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        sortOrder: number;
    }[]>;
    create(dto: CreateTargetGroupDto): import(".prisma/client").Prisma.Prisma__TargetGroupClient<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        sortOrder: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateTargetGroupDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        sortOrder: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        sortOrder: number;
    }>;
}
