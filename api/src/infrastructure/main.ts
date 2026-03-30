import { HttpExceptionFilter } from '@common/errors';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.setGlobalPrefix('api/v1');
  app.use(helmet());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
