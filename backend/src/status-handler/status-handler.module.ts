import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StatusCheckService } from "./status-handler.service";
import { Book, BookSchema } from "src/books/books.schema";
import {
  DigitalResource,
  DigitalResourceSchema,
} from "src/digital-resources/digital-resources.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: DigitalResource.name, schema: DigitalResourceSchema },
    ]),
  ],
  providers: [StatusCheckService],
  exports: [StatusCheckService],
})
export class StatusCheckModule {}
