import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AvailabilityStatus, Book, BookDocument } from "./books.schema";
import { CreateBookDto } from "./books.dto";
import {
  ActivityType,
  ItemType,
  User,
  UserDocument,
} from "src/users/users.schema";
import { StatusCheckService } from "src/status-handler/status-handler.service";

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly statusCheckService: StatusCheckService,
  ) {}

  async create(bookData: CreateBookDto) {
    const book = new this.bookModel(bookData);
    return book.save();
  }

  async findAll() {
    await this.statusCheckService.updateBookStatuses();
    return this.bookModel.find({
      status: { $ne: AvailabilityStatus.Lost },
    });
  }

  async findOne(id: string) {
    const book = await this.bookModel.findById(id);
    if (!book) throw new NotFoundException("Book not found");
    return book;
  }

  async update(id: string, updateData: Partial<Book>) {
    const book = await this.bookModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!book) throw new NotFoundException("Book not found");
    return book;
  }

  async delete(id: string) {
    const result = await this.bookModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException("Book not found");
    return { message: "Book deleted successfully" };
  }

  async borrowBook(
    bookId: string,
    userId: Types.ObjectId,
    startTime: Date,
    endTime: Date,
  ) {
    const book = await this.bookModel.findById(bookId);
    if (!book) throw new NotFoundException("Book not found");

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end)
      throw new BadRequestException("End time must be after start time");
    if (start < now)
      throw new BadRequestException("Start time must be in the future");

    if (book.status !== AvailabilityStatus.Available) {
      throw new BadRequestException(
        "Book is not currently available to borrow",
      );
    }

    book.status = AvailabilityStatus.Borrowed;
    book.borrowedBy = new Types.ObjectId(userId);
    book.startTime = start;
    book.endTime = end;
    await book.save();

    // ➕ Add activity to user
    await this.userModel.findByIdAndUpdate(userId, {
      $push: {
        activityHistory: {
          action: ActivityType.BORROW,
          itemType: ItemType.BOOK,
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

  async reserveBook(
    bookId: string,
    userId: Types.ObjectId,
    reserveStartTime: string | Date,
    reserveEndTime: string | Date,
  ) {
    try {
      const start = new Date(reserveStartTime);
      const end = new Date(reserveEndTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException("Invalid date format");
      }

      const book = await this.bookModel.findById(bookId);
      if (!book) throw new NotFoundException("Book not found");

      const diffInDays = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffInDays > 28) {
        throw new BadRequestException("Reservation cannot exceed 28 days");
      }

      if (book.endTime && start <= book.endTime) {
        throw new BadRequestException(
          "Reservation must start after current borrow period",
        );
      }

      if (
        book.reservedBy &&
        book.reserveEndTime &&
        start <= book.reserveEndTime
      ) {
        throw new BadRequestException(
          "Book is already reserved during the selected time",
        );
      }

      book.reservedBy = new Types.ObjectId(userId);
      book.reserveStartTime = start;
      book.reserveEndTime = end;
      book.status = AvailabilityStatus.Reserved;

      await book.save();

      // ➕ Log reservation activity
      await this.userModel.findByIdAndUpdate(userId, {
        $push: {
          activityHistory: {
            action: ActivityType.RESERVE,
            itemType: ItemType.BOOK,
            itemId: book._id,
            timestamp: new Date(),
            meta: {
              title: book.title,
              reserveStartTime: start,
              reserveEndTime: end,
            },
          },
        },
      });

      return {
        message: "Book reserved successfully",
        updatedBook: book,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async markAsLost(id: string) {
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException("Book not found");
    }

    book.status = AvailabilityStatus.Lost;

    await book.save();

    // 📝 Log in activity history (only if user info is available)
    if (book.borrowedBy) {
      await this.userModel.findByIdAndUpdate(book.borrowedBy, {
        $push: {
          activityHistory: {
            action: ActivityType.LOST,
            itemType: ItemType.BOOK,
            itemId: book._id,
            timestamp: new Date(),
            meta: {
              title: book.title,
            },
          },
        },
      });
    }

    return { message: "Book marked as lost" };
  }

  async renewBook(
    id: string,
    userId: Types.ObjectId,
    startTime: Date,
    endTime: Date,
  ) {
    try {
      const book = await this.bookModel.findById(id);

      if (!book) {
        throw new NotFoundException("Book not found");
      }

      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (start >= end) {
        throw new BadRequestException("End time must be after start time");
      }

      if (start < now) {
        throw new BadRequestException("Start time must be in the future");
      }

      if (book.endTime && start <= book.endTime) {
        throw new BadRequestException(
          "Start date must be after current end date.",
        );
      }

      if (
        !book.borrowedBy ||
        book.borrowedBy.toString() !== userId.toString()
      ) {
        throw new ForbiddenException("You did not borrow this book");
      }

      if (
        book.reservedBy &&
        book.reservedBy.toString() !== userId.toString() &&
        book.reserveStartTime &&
        book.reserveEndTime &&
        new Date() <= book.reserveEndTime
      ) {
        throw new BadRequestException("Book is reserved and cannot be renewed");
      }

      book.startTime = start;
      book.endTime = end;
      book.isRenewed = true;

      await book.save();

      // 📝 Track in user activity history
      await this.userModel.findByIdAndUpdate(userId, {
        $push: {
          activityHistory: {
            action: ActivityType.RENEW,
            itemType: ItemType.BOOK,
            itemId: book._id,
            timestamp: new Date(),
            meta: {
              title: book.title,
              newStartTime: start,
              newEndTime: end,
            },
          },
        },
      });

      return { message: "Book renewed successfully" };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error.message || "Something went wrong");
    }
  }
}
