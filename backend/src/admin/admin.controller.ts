import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateBookDto } from "src/books/books.dto";
import { CreateDigitalResourceDto } from "src/digital-resources/digital-resources.dto";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("create-book")
  createBook(@Body() body: CreateBookDto) {
    return this.adminService.createBook(body);
  }

  @Put("update-book/:id")
  updateBook(@Param("id") id: string, @Body() body: CreateBookDto) {
    return this.adminService.updateBook(id, body);
  }

  @Delete("books/:id")
  deleteBook(@Param("id") id: string) {
    return this.adminService.deleteBook(id);
  }

  @Post("digital-resources")
  createDigital(@Body() body: CreateDigitalResourceDto) {
    return this.adminService.createDigitalResource(body);
  }

  @Put("digital-resources/:id")
  updateDigital(
    @Param("id") id: string,
    @Body() body: Partial<CreateDigitalResourceDto>,
  ) {
    return this.adminService.updateDigitalResource(id, body);
  }

  @Delete("digital-resources/:id")
  deleteDigital(@Param("id") id: string) {
    return this.adminService.deleteDigitalResource(id);
  }

  @Get("books")
  getBooks() {
    return this.adminService.getAllBooks();
  }

  @Get("resources")
  getDigitalResources() {
    return this.adminService.getAllDigitalResources();
  }
}
