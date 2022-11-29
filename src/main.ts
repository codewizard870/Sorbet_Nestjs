import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //controller validation
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  //openapi
  const config = new DocumentBuilder()
    .setTitle("Conversion App")
    .setDescription("...")
    .setVersion("1.0")
    .addBearerAuth()
    //.addTag('main-tag')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port, "0.0.0.0", function () {
    console.log("Server started.......");
  });
}
bootstrap();
