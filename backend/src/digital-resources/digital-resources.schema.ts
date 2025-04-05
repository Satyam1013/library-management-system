import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DigitalResourceDocument = DigitalResource & Document;

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
}

export const DigitalResourceSchema =
  SchemaFactory.createForClass(DigitalResource);
