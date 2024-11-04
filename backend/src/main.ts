import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
    ValidationPipe,
    UnprocessableEntityException,
    type INestApplication,
    type ValidationError,
} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors) => createValidationException(errors),
        }),
    );

    setupSwagger(app);

    await app.listen(3000);
    console.log('Backend listening on port 3000');
}

function createValidationException(
    errors: ValidationError[],
): UnprocessableEntityException {
    const formattedErrors = errors.map(
        (error) => error.constraints[Object.keys(error.constraints)[0]],
    );
    console.log({ formattedErrors });
    return new UnprocessableEntityException(formattedErrors);
}

function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Cocktails API')
        .setDescription('API documentation for the Cocktails application')
        .setVersion('1.0')
        .addTag('cocktails')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
}

bootstrap();
