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
exports.UpdateSiteSettingsDto = exports.StoreDto = exports.ScheduleDto = exports.DayHoursDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const PHONE = /^\+\d{10,15}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const STORE_ID = /^[a-z0-9-]{1,50}$/;
const MAP_URL = /^https:\/\/(www\.google\.com\/maps|maps\.google\.com)\//;
const LOGO = /^(\/|https:\/\/)\S+$/;
class DayHoursDto {
}
exports.DayHoursDto = DayHoursDto;
__decorate([
    (0, class_validator_1.Matches)(TIME),
    __metadata("design:type", String)
], DayHoursDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.Matches)(TIME),
    __metadata("design:type", String)
], DayHoursDto.prototype, "to", void 0);
class ScheduleDto {
}
exports.ScheduleDto = ScheduleDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DayHoursDto),
    __metadata("design:type", Object)
], ScheduleDto.prototype, "weekdays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DayHoursDto),
    __metadata("design:type", Object)
], ScheduleDto.prototype, "saturday", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DayHoursDto),
    __metadata("design:type", Object)
], ScheduleDto.prototype, "sunday", void 0);
class StoreDto {
}
exports.StoreDto = StoreDto;
__decorate([
    (0, class_validator_1.Matches)(STORE_ID),
    __metadata("design:type", String)
], StoreDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], StoreDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], StoreDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2000),
    (0, class_validator_1.Matches)(MAP_URL),
    __metadata("design:type", Object)
], StoreDto.prototype, "mapEmbedUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    (0, class_validator_1.Matches)(LOGO),
    __metadata("design:type", Object)
], StoreDto.prototype, "logo", void 0);
class UpdateSiteSettingsDto {
}
exports.UpdateSiteSettingsDto = UpdateSiteSettingsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(PHONE),
    __metadata("design:type", String)
], UpdateSiteSettingsDto.prototype, "phone1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(PHONE),
    __metadata("design:type", Object)
], UpdateSiteSettingsDto.prototype, "phone2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", Object)
], UpdateSiteSettingsDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(PHONE),
    __metadata("design:type", Object)
], UpdateSiteSettingsDto.prototype, "messengerPhone", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ScheduleDto),
    __metadata("design:type", ScheduleDto)
], UpdateSiteSettingsDto.prototype, "schedule", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StoreDto),
    __metadata("design:type", Array)
], UpdateSiteSettingsDto.prototype, "stores", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSiteSettingsDto.prototype, "citySelectorModal", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSiteSettingsDto.prototype, "citySwitcherHeader", void 0);
//# sourceMappingURL=update-site-settings.dto.js.map