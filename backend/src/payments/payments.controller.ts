import { Controller, Post, Get, Param, Body } from "@nestjs/common";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("pay")
  pay(@Body() body: { userId: string; amount: number }) {
    return this.paymentsService.initiatePayment(body.userId, body.amount);
  }

  @Get("user/:userId")
  getUserPayments(@Param("userId") userId: string) {
    return this.paymentsService.getUserPayments(userId);
  }

  @Get(":paymentId")
  getPayment(@Param("paymentId") paymentId: string) {
    return this.paymentsService.getPaymentById(paymentId);
  }
}
