import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FinesService } from "./fines.service";
import { FinesController } from "./fines.controller";
import { Fine, FineSchema } from "./fines.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fine.name, schema: FineSchema }]),
  ],
  controllers: [FinesController],
  providers: [FinesService],
})
export class FinesModule {}
