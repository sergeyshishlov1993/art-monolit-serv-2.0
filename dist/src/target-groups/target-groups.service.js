"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetGroupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TargetGroupsService = class TargetGroupsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(includeInactive = false) {
        return this.prisma.targetGroup.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    create(dto) {
        return this.prisma.targetGroup.create({ data: dto });
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.targetGroup.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findById(id);
        return this.prisma.targetGroup.delete({ where: { id } });
    }
    async findById(id) {
        const group = await this.prisma.targetGroup.findUnique({ where: { id } });
        if (!group)
            throw new common_1.NotFoundException('Target group not found');
        return group;
    }
};
exports.TargetGroupsService = TargetGroupsService;
exports.TargetGroupsService = TargetGroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TargetGroupsService);
//# sourceMappingURL=target-groups.service.js.map