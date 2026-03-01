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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const upload_service_1 = require("./upload.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let UploadController = class UploadController {
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    uploadCategoryImage(categoryId, file) {
        return this.uploadService.uploadCategoryImage(categoryId, file);
    }
    uploadHeroSlideImage(slideId, file) {
        return this.uploadService.uploadHeroSlideImage(slideId, file);
    }
    uploadProductImage(productId, file, isMain, alt) {
        return this.uploadService.uploadProductImage(productId, file, isMain === 'true', alt);
    }
    uploadPortfolioImage(portfolioWorkId, file, alt) {
        return this.uploadService.uploadPortfolioImage(portfolioWorkId, file, alt);
    }
    bulkUploadPortfolio(files, categoryId, targetGroupIds, materialIds) {
        const parsedTargetGroups = targetGroupIds ? JSON.parse(targetGroupIds) : [];
        const parsedMaterials = materialIds ? JSON.parse(materialIds) : [];
        return this.uploadService.bulkUploadPortfolio(files, categoryId, parsedTargetGroups, parsedMaterials);
    }
    deleteProductImage(imageId) {
        return this.uploadService.deleteProductImage(imageId);
    }
    deletePortfolioImage(imageId) {
        return this.uploadService.deletePortfolioImage(imageId);
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('categories/:categoryId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadCategoryImage", null);
__decorate([
    (0, common_1.Post)('hero-slides/:slideId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('slideId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadHeroSlideImage", null);
__decorate([
    (0, common_1.Post)('products/:productId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('isMain')),
    __param(3, (0, common_1.Body)('alt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadProductImage", null);
__decorate([
    (0, common_1.Post)('portfolio/:portfolioWorkId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('portfolioWorkId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('alt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadPortfolioImage", null);
__decorate([
    (0, common_1.Post)('portfolio-bulk'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 50)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)('categoryId')),
    __param(2, (0, common_1.Body)('targetGroupIds')),
    __param(3, (0, common_1.Body)('materialIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String, String]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "bulkUploadPortfolio", null);
__decorate([
    (0, common_1.Delete)('products/images/:imageId'),
    __param(0, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "deleteProductImage", null);
__decorate([
    (0, common_1.Delete)('portfolio/images/:imageId'),
    __param(0, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "deletePortfolioImage", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map