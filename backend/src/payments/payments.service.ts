/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Payment, PaymentDocument } from "./payments.schema";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async initiatePayment(userId: string, amount: number) {
    const referenceId: string = (uuidv4 as () => string)();

    // Simulate random success/failure
    const isSuccess = Math.random() > 0.2;

    const payment = new this.paymentModel({
      userId,
      amount,
      status: isSuccess ? "success" : "failed",
      referenceId,
    });

    return payment.save();
  }

  async getUserPayments(userId: string) {
    return this.paymentModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getPaymentById(paymentId: string) {
    return this.paymentModel.findById(paymentId);
  }
}
