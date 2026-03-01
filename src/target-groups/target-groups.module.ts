import { Module } from '@nestjs/common';
import { TargetGroupsController } from './target-groups.controller';
import { TargetGroupsService } from './target-groups.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [TargetGroupsController],
    providers: [TargetGroupsService],
})
export class TargetGroupsModule {}