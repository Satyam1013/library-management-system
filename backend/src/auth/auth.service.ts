import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "../users/users.schema";
import { CreateUserDto } from "./create-user.dto";

interface JwtUserPayload {
  _id: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    const user = await createdUser.save();
    const payload: JwtUserPayload = {
      _id: user._id.toString(),
      role: user.role,
    };
    return this.login(payload);
  }

  async validateUser(email: string, password: string): Promise<JwtUserPayload> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        _id: user._id.toString(),
        role: user.role,
      };
    }
    throw new UnauthorizedException("Invalid credentials");
  }

  async login(user: JwtUserPayload) {
    const payload = { sub: user._id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
