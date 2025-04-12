import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DigitalResourcesService } from "./digital-resources.service";
import { DigitalResourcesController } from "./digital-resources.controller";
import {
  DigitalResource,
  DigitalResourceSchema,
} from "./digital-resources.schema";
import { UsersModule } from "src/users/users.module";
import { StatusCheckModule } from "src/status-handler/status-handler.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DigitalResource.name,
        schema: DigitalResourceSchema,
      },
    ]),
    forwardRef(() => UsersModule),
    StatusCheckModule,
  ],
  controllers: [DigitalResourcesController],
  providers: [DigitalResourcesService],
  exports: [MongooseModule],
})
export class DigitalResourcesModule {}
