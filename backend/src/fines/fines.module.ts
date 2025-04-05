import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FinesService } from "./fines.service";
import { FinesController } from "./fines.controller";
import { Fine, FineSchema } from "./fines.schema";
import {
  Transaction,
  TransactionSchema,
} from "../transactions/transactions.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Fine.name, schema: FineSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [FinesController],
  providers: [FinesService],
})
export class FinesModule {}
