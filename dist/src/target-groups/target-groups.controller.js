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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetGroupsController = void 0;
const common_1 = require("@nestjs/common");
const target_groups_service_1 = require("./target-groups.service");
const create_target_group_dto_1 = require("./dto/create-target-group.dto");
const update_target_group_dto_1 = require("./dto/update-target-group.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TargetGroupsController = class TargetGroupsController {
    constructor(targetGroupsService) {
        this.targetGroupsService = targetGroupsService;
    }
    findAll(all) {
        return this.targetGroupsService.findAll(all === 'true');
    }
    create(dto) {
        return this.targetGroupsService.create(dto);
    }
    update(id, dto) {
        return this.targetGroupsService.update(id, dto);
    }
    remove(id) {
        return this.targetGroupsService.remove(id);
    }
};
exports.TargetGroupsController = TargetGroupsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('all')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TargetGroupsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_target_group_dto_1.CreateTargetGroupDto]),
    __metadata("design:returntype", void 0)
], TargetGroupsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_target_group_dto_1.UpdateTargetGroupDto]),
    __metadata("design:returntype", void 0)
], TargetGroupsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TargetGroupsController.prototype, "remove", null);
exports.TargetGroupsController = TargetGroupsController = __decorate([
    (0, common_1.Controller)('target-groups'),
    __metadata("design:paramtypes", [target_groups_service_1.TargetGroupsService])
], TargetGroupsController);
//# sourceMappingURL=target-groups.controller.js.map