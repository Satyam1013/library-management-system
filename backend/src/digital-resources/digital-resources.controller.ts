import { Controller, Get, Param } from "@nestjs/common";
import { DigitalResourcesService } from "./digital-resources.service";

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
}
