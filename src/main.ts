import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get(ConfigService);

    app.enableCors({
        origin: config.get<string>('CORS_ORIGIN'),
        credentials: true,
    });

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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