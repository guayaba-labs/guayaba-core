import { Inject, Injectable } from "@nestjs/common"
import { AUTH_VALIDATION } from "../consts/auth-validation.const"
import { IValidateService } from "../interfaces/validate-provide.interface"
import { LoginDto } from '../domain/request/login.dto'
import { JwtService } from "@nestjs/jwt"
import { LoginResponse } from "../domain/response/login.response"
import { IAuthConfig } from "../interfaces/auth-option.interface"
import { AUTH_OPTION } from "../consts/auth-option.const"

@Injectable()
export class AuthUseCase {

  constructor(
    @Inject(AUTH_VALIDATION)
    private readonly authValidation: IValidateService,
    @Inject(AUTH_OPTION)
    private readonly authOption: IAuthConfig,
    private jwtService: JwtService,
  ) {

  }

  async loginCase(loginDto: LoginDto): Promise<LoginResponse> {

    const resultLogin = await this.authValidation.validate(loginDto.username, loginDto.password)

    const token = await this.jwtService.sign({
      [this.authOption.authUserOption.userFieldId]: resultLogin[this.authOption.authUserOption.userFieldId],
      [this.authOption.authUserOption.userFieldUsername]: resultLogin[this.authOption.authUserOption.userFieldUsername],
    })

    return <LoginResponse> {
      accessToken: token
    }
  }
}