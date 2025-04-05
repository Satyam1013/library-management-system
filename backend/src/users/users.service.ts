import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./users.schema";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new this.userModel({
      ...data,
      password: hashedPassword,
    });

    return user.save();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).select("-password");
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async findAll() {
    return this.userModel.find().select("-password");
  }
}
