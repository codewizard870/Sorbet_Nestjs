import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PasswordsService } from "src/utils/passwords/passwords.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { TokensService } from "src/utils/tokens/tokens.service";
import { UsersModule } from "src/models/users/users.module";
import { UsersService } from "src/models/users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./Strategies/jwt.strategy";
import { LocalStrategy } from "./Strategies/local.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "24h" },
    }),
  ],

  controllers: [AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthService,
    UsersService,
    PrismaService,
    TokensService,
    PasswordsService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
