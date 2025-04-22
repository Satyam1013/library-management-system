import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AvailabilityStatus, Book, BookDocument } from "../books/books.schema";
import {
  DigitalResource,
  DigitalResourceDocument,
} from "../digital-resources/digital-resources.schema";
import { CreateBookDto } from "src/books/books.dto";
import { CreateDigitalResourceDto } from "src/digital-resources/digital-resources.dto";
import { User } from "src/users/users.schema";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(DigitalResource.name)
    private digitalModel: Model<DigitalResourceDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // BOOKS
  async getAllBooks() {
    return this.bookModel.find();
  }

  async getUserActivity() {
    const users = await this.userModel.find({ role: { $ne: "admin" } });
    // const activityHistory = users.map((user) => user.activityHistory);
    return users;
  }

  async createBook(data: CreateBookDto) {
    try {
      const count = await this.bookModel.countDocuments({
        bookId: data.bookId,
      });

      const copyId = count === 0 ? data.bookId : `${data.bookId}-${count}`;

      const newBook = await this.bookModel.create({
        ...data,
        copyId,
        status: AvailabilityStatus.Available,
      });

      return newBook;
    } catch (error) {
      console.error("Error creating book:", error);
    }
  }

  async updateBook(id: string, data: Partial<CreateBookDto>) {
    const updated = await this.bookModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updated) throw new NotFoundException("Book not found");
    return updated;
  }

  async deleteBook(id: string) {
    const deleted = await this.bookModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException("Book not found");
    return { message: "Book deleted successfully" };
  }

  // DIGITAL RESOURCES
  async createDigitalResource(data: CreateDigitalResourceDto) {
    return this.digitalModel.create(data);
  }

  async updateDigitalResource(
    id: string,
    data: Partial<CreateDigitalResourceDto>,
  ) {
    const updated = await this.digitalModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updated) throw new NotFoundException("Resource not found");
    return updated;
  }

  async deleteDigitalResource(id: string) {
    const deleted = await this.digitalModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException("Resource not found");
    return { message: "Digital resource deleted successfully" };
  }

  async getAllDigitalResources() {
    return this.digitalModel.find();
  }
}
