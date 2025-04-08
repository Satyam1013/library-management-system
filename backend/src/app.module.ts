import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { BooksModule } from "./books/books.module";
import { DigitalResourcesModule } from "./digital-resources/digital-resources.module";
import { FinesModule } from "./fines/fines.module";
import { PaymentsModule } from "./payments/payments.module";
import { ReservationsModule } from "./reservations/reservations.module";
import { AdminModule } from "./admin/admin.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    AdminModule,
    AuthModule,
    UsersModule,
    BooksModule,
    DigitalResourcesModule,
    FinesModule,
    PaymentsModule,
    ReservationsModule,
  ],
})
export class AppModule {}
