import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * OpenAPI configuration for TutorMatch API
 */
export class OpenApiConfiguration {
  /**
   * Configures and sets up Swagger documentation for the application
   * @param app The Nest application instance
   */
  public static setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('TutorMatch API')
      .setDescription('TutorMatch application REST API documentation.')
      .setVersion('v1.0.0')
      .setLicense('Apache 2.0', 'https://www.apache.org/licenses/LICENSE-2.0')
      .setExternalDoc('TutorMatch wiki Documentation', 'https://github.com/SkillSwap-UPC/TutorMatch-Report')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'bearerAuth',
        },
        'bearerAuth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger-ui', app, document);
  }
}