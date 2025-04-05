import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  bookId: string;

  @Prop({ default: "borrowed" })
  status: "borrowed" | "returned";

  @Prop()
  borrowedAt: Date;

  @Prop()
  returnedAt: Date;

  @Prop()
  renewedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
