import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule, ConfigModule],
    controllers: [PortfolioController],
    providers: [PortfolioService],
})
export class PortfolioModule {}