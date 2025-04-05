import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Reservation, ReservationDocument } from "./reservations.schema";

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async createReservation(userId: string, bookId: string) {
    const reservation = new this.reservationModel({
      userId,
      bookId,
      status: "active",
      reservedAt: new Date(),
    });
    return reservation.save();
  }

  async cancelReservation(reservationId: string) {
    const reservation = await this.reservationModel.findById(reservationId);
    if (!reservation) throw new NotFoundException("Reservation not found");

    reservation.status = "cancelled";
    reservation.cancelledAt = new Date();
    return reservation.save();
  }

  async getUserReservations(userId: string) {
    return this.reservationModel.find({ userId });
  }
}
