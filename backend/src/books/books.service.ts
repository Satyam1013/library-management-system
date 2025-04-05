import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book, BookDocument } from "./books.schema";

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async create(bookData: Partial<Book>) {
    const book = new this.bookModel(bookData);
    return book.save();
  }

  async findAll() {
    return this.bookModel.find();
  }

  async findOne(id: string) {
    const book = await this.bookModel.findById(id);
    if (!book) throw new NotFoundException("Book not found");
    return book;
  }

  async update(id: string, updateData: Partial<Book>) {
    const book = await this.bookModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!book) throw new NotFoundException("Book not found");
    return book;
  }

  async delete(id: string) {
    const result = await this.bookModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException("Book not found");
    return { message: "Book deleted successfully" };
  }
}
