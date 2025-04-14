import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { UserRole } from "src/auth/create-user.dto";

export type UserDocument = User & Document;

export enum ActivityType {
  BORROW = "borrow",
  RETURN = "return",
  RESERVE = "reserve",
  LOST = "lost",
  RENEW = "renew",
}

export enum ItemType {
  BOOK = "book",
  EBOOK = "ebook",
}

@Schema({ _id: false })
export class UserActivity {
  @Prop({ type: String, enum: ActivityType, required: true })
  action: ActivityType;

  @Prop({ type: String, enum: ItemType, required: true })
  itemType: ItemType;

  @Prop({ type: Types.ObjectId, required: true })
  itemId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;

  @Prop({ type: Object, default: {} }) // You can customize this if needed
  meta?: Record<string, any>;
}

export const UserActivitySchema = SchemaFactory.createForClass(UserActivity);

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
  mobile: string;

  @Prop({ type: [UserActivitySchema], default: [] })
  activityHistory: UserActivity[];

  @Prop({ enum: UserRole, required: true })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
