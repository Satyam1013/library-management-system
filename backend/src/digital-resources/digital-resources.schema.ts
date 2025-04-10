import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type DigitalResourceDocument = DigitalResource & Document;

@Schema({ _id: false })
export class BorrowInfo {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user: Types.ObjectId;

  @Prop({ type: Date, required: true })
  startTime: Date;

  @Prop({ type: Date, required: true })
  endTime: Date;

  @Prop({ type: Boolean, default: false })
  timeEnded: boolean;
}

export const BorrowInfoSchema = SchemaFactory.createForClass(BorrowInfo);

@Schema()
export class DigitalResource {
  @Prop({ required: true })
  resourceId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true })
  cost: number;

  @Prop({ type: [BorrowInfoSchema], default: [] })
  borrowedBy: BorrowInfo[];
}

export const DigitalResourceSchema =
  SchemaFactory.createForClass(DigitalResource);
