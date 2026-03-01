import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule, ConfigModule],
    controllers: [CategoriesController],
    providers: [CategoriesService],
})
export class CategoriesModule {}