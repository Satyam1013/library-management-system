import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "./users.schema";
import { Book } from "src/books/books.schema";
import {
  DigitalResource,
  DigitalResourceDocument,
} from "src/digital-resources/digital-resources.schema";
import { StatusCheckService } from "src/status-handler/status-handler.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @InjectModel(DigitalResource.name)
    private digitalResourceModel: Model<DigitalResourceDocument>,
    private readonly statusCheckService: StatusCheckService,
  ) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id).select("-password");
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async findAll() {
    return this.userModel.find().select("-password");
  }

  async getUserBooks(userId: string | Types.ObjectId) {
    const objectUserId = new Types.ObjectId(userId);

    await this.statusCheckService.updateBookStatuses();
    await this.statusCheckService.updateDigitalResourceStatuses();

    const borrowedBooks = await this.bookModel.find({
      borrowedBy: objectUserId,
    });

    const reservedBooks = await this.bookModel.find({
      reservedBy: objectUserId,
    });

    const borrowedEBooks = await this.digitalResourceModel.find({
      borrowedBy: {
        $elemMatch: {
          user: objectUserId,
        },
      },
    });

    return { borrowedBooks, reservedBooks, borrowedEBooks };
  }

  async getStats() {
    // 🛠 Update all statuses first
    await this.statusCheckService.updateBookStatuses();
    await this.statusCheckService.updateDigitalResourceStatuses();

    // 📚 Book stats
    const totalBooks = await this.bookModel.countDocuments();
    const borrowedBooks = await this.bookModel.countDocuments({
      status: "borrowed",
    });
    const reservedBooks = await this.bookModel.countDocuments({
      status: "reserved",
    });
    const availableBooks = await this.bookModel.countDocuments({
      status: "available",
    });
    const lostBooks = await this.bookModel.countDocuments({ status: "lost" });

    // 💾 Ebook stats
    const totalEbooks = await this.digitalResourceModel.countDocuments();
    const borrowedEbooks = await this.digitalResourceModel.countDocuments({
      borrowedBy: { $exists: true, $not: { $size: 0 } },
    });

    return {
      books: {
        total: totalBooks,
        available: availableBooks,
        reserved: reservedBooks,
        borrowed: borrowedBooks,
        lost: lostBooks,
      },
      ebooks: {
        total: totalEbooks,
        borrowed: borrowedEbooks,
      },
    };
  }
}
