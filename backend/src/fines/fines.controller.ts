import { Controller, Get, Param, Post } from "@nestjs/common";
import { FinesService } from "./fines.service";

@Controller("fines")
export class FinesController {
  constructor(private readonly finesService: FinesService) {}

  @Post("calculate/:transactionId")
  calculate(@Param("transactionId") id: string) {
    return this.finesService.calculateFine(id);
  }

  @Get("user/:userId")
  getUserFines(@Param("userId") userId: string) {
    return this.finesService.findUserFines(userId);
  }

  @Post("pay/:fineId")
  payFine(@Param("fineId") fineId: string) {
    return this.finesService.payFine(fineId);
  }
}
