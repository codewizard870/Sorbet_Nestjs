import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import * as session from 'express-session'
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // controller validation
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  // passport initialization
  app.use(session({
    secret: 'thesecret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  // openapi
  const config = new DocumentBuilder()
    .setTitle("Conversion App")
    .setDescription("...")
    .setVersion("1.0")
    .addBearerAuth()
    // .addTag('main-tag')
    .build();
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("swagger", app, document)

  const port = process.env.PORT || 8080;

  await app.listen(port, "0.0.0.0", function () {
    console.log(`Server started on port: ${port}`)
  })
}
bootstrap()
