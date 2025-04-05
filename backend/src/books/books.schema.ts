import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ required: true })
  copyId: string;

  @Prop({ required: true })
  bookId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  isbn: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  location: string;

  @Prop({ default: true })
  available: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);
