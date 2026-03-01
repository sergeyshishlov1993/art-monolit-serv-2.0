import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { LeadsModule } from './leads/leads.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { UploadModule } from './upload/upload.module';
import { TargetGroupsModule } from './target-groups/target-groups.module';
import { MaterialsModule } from './materials/materials.module';
import { HeroSlidesModule } from './hero-slides/hero-slides.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        AuthModule,
        CategoriesModule,
        ProductsModule,
        LeadsModule,
        PortfolioModule,
        UploadModule,
        TargetGroupsModule,
        MaterialsModule,
        HeroSlidesModule,
        TelegramModule,
    ],
})
export class AppModule {}