import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativa o ValidationPipe globalmente
  // 'whitelist: true' remove automaticamente propriedades que não estão no DTO
  // 'forbidNonWhitelisted: true' lança um erro se propriedades extra forem enviadas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Transforma os tipos de dados (ex: string de ID da URL para número)
    }),
  );

  // Define um prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  // Habilita o CORS para que o frontend React possa aceder
  app.enableCors();

  await app.listen(3000);
  console.log(`🚀 Servidor NestJS rodando em: http://localhost:3000`);
}
bootstrap();
