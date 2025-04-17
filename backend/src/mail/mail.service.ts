/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  async sendBookLostRefundEmail(
    email: string,
    bookTitle: string,
    refundAmount: number,
  ) {
    const mailOptions = {
      to: email,
      subject: "Book Reservation Refund",
      html: `
        <p>Hello,</p>
        <p>We regret to inform you that the book <strong>${bookTitle}</strong> which you had reserved is no longer available as it was marked lost by the borrower.</p>
        <p>A refund of <strong>₹${refundAmount}</strong> is being processed to your account.</p>
        <p>Thank you for your understanding.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
