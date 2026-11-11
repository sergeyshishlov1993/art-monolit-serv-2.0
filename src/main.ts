import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // За nginx: інакше всі запити мають IP 127.0.0.1 і ліміт заявок спрацьовує на всіх разом
    app.set('trust proxy', 1);

    const config = app.get(ConfigService);

    app.enableCors({
        origin: config.get<string>('CORS_ORIGIN'),
        credentials: true,
    });

    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    app.setGlobalPrefix('api');

    const port = config.get<number>('PORT', 4000);
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
}

bootstrap();