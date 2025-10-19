import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors({
    origin: '*',
  });
  app.use(helmet());
  app.setGlobalPrefix('api/v1');
  console.log('Server is running on port', process.env.PORT ?? 3000);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
