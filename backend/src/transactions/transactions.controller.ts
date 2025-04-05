import { Controller, Post, Param, Body, Get } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post("borrow")
  borrow(@Body() body: { userId: string; bookId: string }) {
    return this.transactionsService.borrowBook(body.userId, body.bookId);
  }

  @Post("return/:id")
  return(@Param("id") id: string) {
    return this.transactionsService.returnBook(id);
  }

  @Post("renew/:id")
  renew(@Param("id") id: string) {
    return this.transactionsService.renewBook(id);
  }

  @Get("user/:userId")
  findByUser(@Param("userId") userId: string) {
    return this.transactionsService.findUserTransactions(userId);
  }
}
