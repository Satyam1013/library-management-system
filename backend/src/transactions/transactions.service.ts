import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Transaction, TransactionDocument } from "./transactions.schema";
import { Book, BookDocument } from "../books/books.schema";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(Book.name)
    private bookModel: Model<BookDocument>,
  ) {}

  async borrowBook(userId: string, bookId: string) {
    const book = await this.bookModel.findById(bookId);
    if (!book) throw new NotFoundException("Book not found");

    const transaction = new this.transactionModel({
      userId,
      bookId,
      status: "borrowed",
      borrowedAt: new Date(),
    });

    return transaction.save();
  }

  async returnBook(transactionId: string) {
    const transaction = await this.transactionModel.findById(transactionId);
    if (!transaction) throw new NotFoundException("Transaction not found");

    transaction.status = "returned";
    transaction.returnedAt = new Date();
    return transaction.save();
  }

  async renewBook(transactionId: string) {
    const transaction = await this.transactionModel.findById(transactionId);
    if (!transaction) throw new NotFoundException("Transaction not found");

    transaction.renewedAt = new Date();
    return transaction.save();
  }

  async findUserTransactions(userId: string) {
    return this.transactionModel.find({ userId });
  }
}
