import { Controller, Post, Param, Body, Get } from "@nestjs/common";
import { ReservationsService } from "./reservations.service";

@Controller("reservations")
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  reserve(@Body() body: { userId: string; bookId: string }) {
    return this.reservationsService.createReservation(body.userId, body.bookId);
  }

  @Post("cancel/:id")
  cancel(@Param("id") id: string) {
    return this.reservationsService.cancelReservation(id);
  }

  @Get("user/:userId")
  getByUser(@Param("userId") userId: string) {
    return this.reservationsService.getUserReservations(userId);
  }
}
