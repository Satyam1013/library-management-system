export interface Book {
  _id?: string;
  copyId: string;
  bookId: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  location: string;
  status: "available" | "reserved" | "borrowed" | "lost";
}
