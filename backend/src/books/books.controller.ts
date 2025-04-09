import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { BooksService } from "./books.service";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { AuthenticatedRequest } from "src/common/common.types";
import { BorrowBookDto, ReserveBookDto } from "./books.dto";

@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.booksService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/borrow")
  borrowBook(
    @Param("id") id: string,
    @Body() { startTime, endTime }: BorrowBookDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user._id;
    return this.booksService.borrowBook(id, userId, startTime, endTime);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/reserve")
  async reserveBook(
    @Param("id") id: string,
    @Body() { reserveStartTime, reserveEndTime }: ReserveBookDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user._id;
    return this.booksService.reserveBook(
      id,
      userId,
      reserveStartTime,
      reserveEndTime,
    );
  }

  @Patch(":id/lost")
  @UseGuards(JwtAuthGuard)
  markBookAsLost(@Param("id") id: string) {
    return this.booksService.markAsLost(id);
  }

  @Patch(":id/renew")
  @UseGuards(JwtAuthGuard)
  renewBook(@Param("id") id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user._id;
    return this.booksService.renewBook(id, userId);
  }
}
