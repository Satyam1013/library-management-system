import { Controller, Post, Body, Get, Param, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  async register(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      role: string;
    },
  ) {
    return this.usersService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getOne(@Param("id") id: string) {
    return this.usersService.findById(id);
  }
}
