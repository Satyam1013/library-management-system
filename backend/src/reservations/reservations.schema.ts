import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  bookId: string;

  @Prop({ default: "active" })
  status: "active" | "cancelled";

  @Prop()
  reservedAt: Date;

  @Prop()
  cancelledAt: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
