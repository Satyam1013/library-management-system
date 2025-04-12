import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book, BookDocument, AvailabilityStatus } from "src/books/books.schema";
import {
  DigitalResource,
  DigitalResourceDocument,
} from "src/digital-resources/digital-resources.schema";

@Injectable()
export class StatusCheckService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(DigitalResource.name)
    private digitalModel: Model<DigitalResourceDocument>,
  ) {}

  async updateBookStatuses() {
    const currentTime = new Date();

    // 1. Make expired borrowed books available
    await this.bookModel.updateMany(
      {
        status: AvailabilityStatus.Borrowed,
        endTime: { $lt: currentTime },
      },
      {
        $set: {
          status: AvailabilityStatus.Available,
          borrowedBy: null,
          startTime: null,
          endTime: null,
          isRenewed: false,
        },
      },
    );

    // 2. Convert reserved books to borrowed using reserveStart/EndTime
    await this.bookModel.updateMany(
      {
        status: AvailabilityStatus.Reserved,
        reserveEndTime: { $lt: currentTime },
      },
      [
        {
          $set: {
            status: AvailabilityStatus.Borrowed,
            startTime: "$reserveStartTime",
            endTime: "$reserveEndTime",
          },
        },
        {
          $unset: ["reserveStartTime", "reserveEndTime"],
        },
      ],
    );
  }

  async updateDigitalResourceStatuses() {
    const currentTime = new Date();
    const digitalResources = await this.digitalModel.find();

    for (const resource of digitalResources) {
      let isModified = false;

      for (const borrowInfo of resource.borrowedBy) {
        if (!borrowInfo.timeEnded && borrowInfo.endTime < currentTime) {
          borrowInfo.timeEnded = true;
          isModified = true;
        }
      }

      if (isModified) {
        await resource.save();
      }
    }
  }

  async runStatusCheck() {
    await this.updateBookStatuses();
    await this.updateDigitalResourceStatuses();
  }
}
