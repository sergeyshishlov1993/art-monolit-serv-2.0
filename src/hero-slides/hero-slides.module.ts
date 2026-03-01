import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HeroSlidesService } from './hero-slides.service';
import { HeroSlidesController } from './hero-slides.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule, ConfigModule],
    controllers: [HeroSlidesController],
    providers: [HeroSlidesService],
})
export class HeroSlidesModule {}