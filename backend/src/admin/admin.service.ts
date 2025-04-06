import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book, BookDocument } from "../books/books.schema";
import {
  DigitalResource,
  DigitalResourceDocument,
} from "../digital-resources/digital-resources.schema";
import { CreateBookDto } from "src/books/books.dto";
import { CreateDigitalResourceDto } from "src/digital-resources/digital-resources.dto";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(DigitalResource.name)
    private digitalModel: Model<DigitalResourceDocument>,
  ) {}

  // BOOKS
  async createBook(data: CreateBookDto) {
    // Count how many copies exist for this bookId
    const count = await this.bookModel.countDocuments({ bookId: data.bookId });

    // If count is 0, it's the first copy, so copyId is same as bookId.
    // Otherwise, append count as a suffix.
    const copyId = count === 0 ? data.bookId : `${data.bookId}-${count}`;

    // Create the book with the generated copyId.
    const newBook = await this.bookModel.create({ ...data, copyId });
    return newBook;
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

  async getAllBooks() {
    return this.bookModel.find();
  }

  async getAllDigitalResources() {
    return this.digitalModel.find();
  }
}
