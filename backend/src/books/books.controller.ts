import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { BooksService } from "./books.service";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { AuthenticatedRequest } from "src/common/common.types";
import { BorrowBookDto } from "./books.dto";

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
}
