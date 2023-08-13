import { Body, Controller, Get, HttpStatus, Post, Request, Res, UseGuards } from "@nestjs/common"
import { AuthUseCase } from "../use-case/auth.use-case"
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger"
import { LoginDto } from "../domain/request/login.dto"
import { LoginResponse } from "../domain/response/login.response"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { FirebaseAuthGuard } from "../guards/firebase-auth.guard"

@Controller("auth")
@ApiTags("auth")
export class AuthController {

  constructor(
    private readonly authUseCase: AuthUseCase
  ) { }

  @Post("/login")
  @ApiBody({
    type: LoginDto
  })
  @ApiResponse({
    status: 200,
    type: LoginResponse
  })
  async login(
    @Body() request: LoginDto,
    @Res() response
  ) {

    const accessToken = await this.authUseCase.loginCase(request)

    return response.status(HttpStatus.OK).json(<LoginResponse>(accessToken))
  }

  @UseGuards(JwtAuthGuard)
  @Get('/currentUser')
  userLocal(@Request() req) {
    return req.user;
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}