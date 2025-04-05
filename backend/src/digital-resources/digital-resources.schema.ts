import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DigitalResourceDocument = DigitalResource & Document;

@Schema()
export class DigitalResource {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  downloadUrl: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const DigitalResourceSchema =
  SchemaFactory.createForClass(DigitalResource);
