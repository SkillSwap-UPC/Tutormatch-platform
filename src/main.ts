import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de CORS (opcional)
  app.enableCors();
  
  // Configurar codificación UTF-8
  app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('TutorMatch API')
    .setDescription('API para la plataforma TutorMatch de gestión de tutorías académicas')
    .setVersion('1.0')
    .addTag('profiles', 'Operaciones relacionadas con perfiles de usuarios')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
  
  console.log(`Aplicación ejecutándose en: ${await app.getUrl()}`);
  console.log(`Documentación Swagger disponible en: ${await app.getUrl()}/api`);
}
bootstrap();