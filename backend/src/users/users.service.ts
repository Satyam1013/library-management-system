import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "./users.schema";
import * as bcrypt from "bcrypt";
import { Book } from "src/books/books.schema";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

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

  async getUserBooks(userId: string | Types.ObjectId) {
    const objectUserId = new Types.ObjectId(userId);

    const borrowedBooks = await this.bookModel.find({
      borrowedBy: objectUserId,
    });

    const reservedBooks = await this.bookModel.find({
      reservedBy: objectUserId,
    });

    return { borrowedBooks, reservedBooks };
  }
}
