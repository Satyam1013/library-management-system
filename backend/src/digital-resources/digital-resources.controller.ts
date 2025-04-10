import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { DigitalResourcesService } from "./digital-resources.service";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { eBookDto } from "./digital-resources.dto";
import { AuthenticatedRequest } from "src/common/common.types";

@Controller("digital-resources")
export class DigitalResourcesController {
  constructor(
    private readonly digitalResourcesService: DigitalResourcesService,
  ) {}

  @Get()
  findAll() {
    return this.digitalResourcesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.digitalResourcesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/borrow")
  borrowBook(
    @Param("id") id: string,
    @Body() { startTime, endTime }: eBookDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user._id;
    return this.digitalResourcesService.eBookBorrow(
      id,
      userId,
      startTime,
      endTime,
    );
  }
}
