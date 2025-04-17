import { Controller, Post, Body, Patch } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post("login")
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Patch("change-password")
  changePassword(
    @Body()
    body: {
      email: string;
      oldPassword: string;
      newPassword: string;
    },
  ) {
    return this.authService.changePassword(
      body.email,
      body.oldPassword,
      body.newPassword,
    );
  }
}
