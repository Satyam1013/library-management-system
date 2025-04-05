import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Fine, FineDocument } from "./fines.schema";
import {
  Transaction,
  TransactionDocument,
} from "../transactions/transactions.schema";

@Injectable()
export class FinesService {
  constructor(
    @InjectModel(Fine.name) private fineModel: Model<FineDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async calculateFine(transactionId: string): Promise<Fine> {
    const transaction = await this.transactionModel.findById(transactionId);
    if (!transaction) throw new NotFoundException("Transaction not found");

    const dueDate = new Date(transaction.borrowedAt);
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks borrow time

    const now = new Date();
    if (transaction.status !== "returned" || now <= dueDate) {
      throw new Error("No fine needed.");
    }

    const daysLate = Math.ceil(
      (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const amount = daysLate * 5; // ₹5 per day

    const fine = new this.fineModel({
      userId: transaction.userId,
      amount,
      reason: `Returned ${daysLate} day(s) late`,
    });

    return fine.save();
  }

  async findUserFines(userId: string) {
    return this.fineModel.find({ userId });
  }

  async payFine(fineId: string) {
    const fine = await this.fineModel.findById(fineId);
    if (!fine) throw new NotFoundException("Fine not found");

    fine.paid = true;
    return fine.save();
  }
}
