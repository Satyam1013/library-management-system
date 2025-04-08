import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AvailabilityStatus, Book, BookDocument } from "./books.schema";
import { CreateBookDto } from "./books.dto";

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async create(bookData: CreateBookDto) {
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

  async borrowBook(
    bookId: string,
    userId: Types.ObjectId,
    startTime: Date,
    endTime: Date,
  ) {
    try {
      const book = await this.bookModel.findById(bookId);
      if (!book) throw new NotFoundException("Book not found");

      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (start >= end) {
        throw new BadRequestException("End time must be after start time");
      }

      if (start < now) {
        throw new BadRequestException("Start time must be in the future");
      }

      if (book.status === AvailabilityStatus.Available) {
        book.status = AvailabilityStatus.Borrowed;
        book.borrowedBy = userId;
        book.startTime = start;
        book.endTime = end;
        await book.save();

        return {
          message: "Book borrowed successfully",
          updatedBook: book,
        };
      }

      if (
        book.status === AvailabilityStatus.Borrowed ||
        book.status === AvailabilityStatus.Reserved
      ) {
        const isAlreadyReserved = book.reservations.some((id) =>
          id.equals(userId),
        );

        if (!isAlreadyReserved) {
          book.reservations.push(userId);
          book.status = AvailabilityStatus.Reserved;
          await book.save();
        }

        return {
          message: "Book reserved. You are in the queue.",
          updatedBook: book,
        };
      }

      throw new BadRequestException(
        "Book is not available to borrow or reserve.",
      );
    } catch (err) {
      console.log("error:", err);
    }
  }
}
