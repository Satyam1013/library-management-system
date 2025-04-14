import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  MinLength,
} from "class-validator";

export enum UserRole {
  ADMIN = "admin",
  STUDENT = "student",
  LIBRARIAN = "librarian",
}

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(UserRole, { message: "role must be admin, student, or librarian" })
  role: UserRole;

  @IsNotEmpty()
  @IsMobilePhone("en-IN")
  mobile: string;
}
