import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Configuration } from './shared/config/configuration.enum';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get(Configuration.PORT);
  const isDev = configService.get(Configuration.ENVIRONMENT) === 'development';

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS')
    .setDescription('NestJS API Training')
    .setVersion('1.0')
    .addServer(isDev ? 'http://' : 'https://')
    .addBearerAuth()
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, swaggerDoc);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(port);
}
bootstrap();
