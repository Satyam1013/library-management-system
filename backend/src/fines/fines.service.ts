import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Fine, FineDocument } from "./fines.schema";

@Injectable()
export class FinesService {
  constructor(@InjectModel(Fine.name) private fineModel: Model<FineDocument>) {}

  async findUserFines(userId: string) {
    return this.fineModel.find({ userId });
  }

  async payFine(fineId: string) {
    const fine = await this.fineModel.findById(fineId);
    if (!fine) throw new NotFoundException("Fine not found");

    fine.paid = true;
    return fine.save();
  }
}
