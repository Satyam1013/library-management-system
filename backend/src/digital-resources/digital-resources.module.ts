import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DigitalResourcesService } from "./digital-resources.service";
import { DigitalResourcesController } from "./digital-resources.controller";
import {
  DigitalResource,
  DigitalResourceSchema,
} from "./digital-resources.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DigitalResource.name,
        schema: DigitalResourceSchema,
      },
    ]),
  ],
  controllers: [DigitalResourcesController],
  providers: [DigitalResourcesService],
  exports: [MongooseModule],
})
export class DigitalResourcesModule {}
