import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { Admin, AdminSchema } from "./admin.schema";
import { User, UserSchema } from "../users/users.schema";
import { Book, BookSchema } from "../books/books.schema";
import {
  Transaction,
  TransactionSchema,
} from "../transactions/transactions.schema";
import {
  DigitalResource,
  DigitalResourceSchema,
} from "src/digital-resources/digital-resources.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: User.name, schema: UserSchema },
      { name: Book.name, schema: BookSchema },
      { name: DigitalResource.name, schema: DigitalResourceSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
