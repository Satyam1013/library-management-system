import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DigitalResourcesService } from "./digital-resources.service";
import { DigitalResourcesController } from "./digital-resources.controller";
import {
  DigitalResource,
  DigitalResourceSchema,
} from "./digital-resources.schema";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DigitalResource.name,
        schema: DigitalResourceSchema,
      },
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [DigitalResourcesController],
  providers: [DigitalResourcesService],
  exports: [MongooseModule],
})
export class DigitalResourcesModule {}
