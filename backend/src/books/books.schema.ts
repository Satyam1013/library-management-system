import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type BookDocument = Book & Document;

export enum AvailabilityStatus {
  Available = "available",
  Borrowed = "borrowed",
  Reserved = "reserved",
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

  @Prop({ type: Types.ObjectId, ref: "User", default: null })
  borrowedBy: Types.ObjectId;

  // Changed from an array to a single reservedBy
  @Prop({ type: Types.ObjectId, ref: "User", default: null })
  reservedBy: Types.ObjectId;

  // New reservation time fields
  @Prop({ type: Date, default: null })
  reserveStartTime: Date;

  @Prop({ type: Date, default: null })
  reserveEndTime: Date;

  // Borrowed time fields
  @Prop({ type: Date, default: null })
  startTime: Date;

  @Prop({ type: Boolean, default: false })
  isRenewed: boolean;

  @Prop({ type: Date, default: null })
  endTime: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
