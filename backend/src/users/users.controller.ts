import { Controller, Get, Param, UseGuards, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { AuthenticatedRequest } from "src/common/common.types";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/profile")
  async getUserBooks(@Req() req: AuthenticatedRequest) {
    const userId = req.user._id;
    return this.usersService.getUserBooks(userId);
  }

  @Get("dashboard")
  async getStats() {
    return this.usersService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getOne(@Param("id") id: string) {
    return this.usersService.findById(id);
  }
}
