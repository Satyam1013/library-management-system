import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { BooksService } from "./books.service";
import { Book } from "./books.schema";

@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() bookData: Partial<Book>) {
    return this.booksService.create(bookData);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.booksService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateData: Partial<Book>) {
    return this.booksService.update(id, updateData);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.booksService.delete(id);
  }
}
