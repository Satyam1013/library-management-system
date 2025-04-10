import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "./users.schema";
import { Book } from "src/books/books.schema";
import {
  DigitalResource,
  DigitalResourceDocument,
} from "src/digital-resources/digital-resources.schema";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @InjectModel(DigitalResource.name)
    private digitalResourceModel: Model<DigitalResourceDocument>,
  ) {}

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

  async getStats() {
    const totalBooks = await this.bookModel.countDocuments();
    const borrowed = await this.bookModel.countDocuments({
      status: "borrowed",
    });
    const reserved = await this.bookModel.countDocuments({
      status: "reserved",
    });
    const available = await this.bookModel.countDocuments({
      status: "available",
    });
    const resources = await this.digitalResourceModel.countDocuments();

    return {
      books: totalBooks,
      borrowed,
      reserved,
      available,
      resources,
    };
  }
}
