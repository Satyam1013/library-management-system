import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  copyId: string;

  @IsNotEmpty()
  @IsString()
  bookId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  isbn: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsBoolean()
  available: boolean;
}

export class CreateDigitalResourceDto {
  @IsNotEmpty()
  @IsString()
  resourceId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  fileUrl: string;

  @IsNotEmpty()
  @IsNumber()
  cost: number;
}
