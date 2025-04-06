import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { AvailabilityStatus } from "./books.schema";

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(AvailabilityStatus)
  status: AvailabilityStatus;
}
