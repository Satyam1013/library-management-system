import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BooksService } from "./books.service";
import { BooksController } from "./books.controller";
import { Book, BookSchema } from "./books.schema";
import { UsersModule } from "src/users/users.module";
import { StatusCheckModule } from "src/status-handler/status-handler.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    forwardRef(() => UsersModule),
    StatusCheckModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [MongooseModule],
})
export class BooksModule {}
