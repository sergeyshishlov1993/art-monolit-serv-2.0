import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule, ConfigModule],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}