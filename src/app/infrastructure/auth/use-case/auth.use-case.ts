import { Inject, Injectable } from "@nestjs/common"
import { AUTH_SERVICE } from "../consts/auth-validation.const"
import { IValidateService } from "../interfaces/validate-provide.interface"
import { LoginDto } from '../domain/request/login.dto'
import { JwtService } from "@nestjs/jwt"
import { LoginResponse } from "../domain/response/login.response"
import { IAuthConfig } from "../interfaces/auth-option.interface"
import { AUTH_OPTIONS } from "../consts/auth-option.const"
import { JWTUserPayload } from "../interfaces/jwt-user.interface"

@Injectable()
export class AuthUseCase {

  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authValidation: IValidateService,
    @Inject(AUTH_OPTIONS)
    private readonly authOption: IAuthConfig,
    private jwtService: JwtService,
  ) {

  }

  async loginCase(loginDto: LoginDto): Promise<LoginResponse> {

    const resultLogin = await this.authValidation.validate(loginDto.username, loginDto.password)

    const authUserField = this.authOption.authUserOption

    const payloadLoginCase: JWTUserPayload = {
      [authUserField.userFieldId]: resultLogin[authUserField.userFieldId],
      [authUserField.userFieldUsername]: resultLogin[authUserField.userFieldUsername],
    }

    const token = await this.jwtService.sign(payloadLoginCase)

    return <LoginResponse> {
      accessToken: token
    }
  }
}