import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  DigitalResource,
  DigitalResourceDocument,
} from "./digital-resources.schema";
import {
  ActivityType,
  ItemType,
  User,
  UserDocument,
} from "src/users/users.schema";

@Injectable()
export class DigitalResourcesService {
  constructor(
    @InjectModel(DigitalResource.name)
    private digitalResourceModel: Model<DigitalResourceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<DigitalResource[]> {
    return this.digitalResourceModel.find();
  }

  async findOne(id: string): Promise<DigitalResource> {
    const resource = await this.digitalResourceModel.findById(id);
    if (!resource) throw new NotFoundException("Resource not found");
    return resource;
  }
  async eBookBorrow(
    bookId: string,
    userId: Types.ObjectId,
    startTime: Date,
    endTime: Date,
  ) {
    const book = await this.digitalResourceModel.findById(bookId);
    if (!book) throw new NotFoundException("Book not found");

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedStart = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );

    if (start >= end)
      throw new BadRequestException("End time must be after start time");

    if (selectedStart < today)
      throw new BadRequestException(
        "Start time must be today or in the future",
      );

    const diffInTime = end.getTime() - start.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    const maxBorrowDays = 28;

    if (diffInDays > maxBorrowDays) {
      throw new BadRequestException(
        `Borrow duration cannot exceed ${maxBorrowDays} days`,
      );
    }

    const alreadyBorrowed = book.borrowedBy.some((entry) => {
      return (
        entry.user.toString() === userId.toString() &&
        new Date(entry.endTime) > now
      );
    });

    if (alreadyBorrowed) {
      throw new BadRequestException(
        "You have already borrowed or reserved this book",
      );
    }

    // Add to digital resource's borrowedBy array
    book.borrowedBy.push({
      user: new Types.ObjectId(userId),
      startTime: start,
      endTime: end,
      timeEnded: false,
    });

    await book.save();

    // ➕ Add activity to user
    await this.userModel.findByIdAndUpdate(userId, {
      $push: {
        activityHistory: {
          action: ActivityType.BORROW,
          itemType: ItemType.EBOOK,
          itemId: book._id,
          timestamp: new Date(),
          meta: {
            title: book.title,
            startTime: start,
            endTime: end,
          },
        },
      },
    });

    return {
      message: "Book borrowed successfully",
      updatedBook: book,
    };
  }
}
