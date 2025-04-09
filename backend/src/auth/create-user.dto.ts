import { IsEmail, IsEnum, IsNotEmpty, MinLength } from "class-validator";

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

  @IsEnum(UserRole, { message: "role must be admin, user, or librarian" })
  role: UserRole;
}
