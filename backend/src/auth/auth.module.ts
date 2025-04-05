// src/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/users.schema";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ secret: "secret", signOptions: { expiresIn: "7d" } }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
