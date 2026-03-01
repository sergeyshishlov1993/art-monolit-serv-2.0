"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTargetGroupDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_target_group_dto_1 = require("./create-target-group.dto");
class UpdateTargetGroupDto extends (0, mapped_types_1.PartialType)(create_target_group_dto_1.CreateTargetGroupDto) {
}
exports.UpdateTargetGroupDto = UpdateTargetGroupDto;
//# sourceMappingURL=update-target-group.dto.js.map