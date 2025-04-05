import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { UserRole } from "src/auth/create-user.dto";

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  mobile: number;

  @Prop({ required: true })
  borrowingHistory: [];

  @Prop({ enum: UserRole, required: true })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
