import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BookDocument = Book & Document;

export enum AvailabilityStatus {
  Available = "available",
  Reserved = "reserved",
  Borrowed = "borrowed",
  Lost = "lost",
}

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

  @Prop({ enum: AvailabilityStatus, required: true })
  status: AvailabilityStatus;
}
export const BookSchema = SchemaFactory.createForClass(Book);
BookSchema.set("timestamps", true);
