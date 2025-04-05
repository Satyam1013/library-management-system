import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type FineDocument = Fine & Document;

@Schema()
export class Fine {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: false })
  paid: boolean;

  @Prop()
  reason: string;

  @Prop({ default: Date.now })
  issuedAt: Date;
}

export const FineSchema = SchemaFactory.createForClass(Fine);
