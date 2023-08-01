
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local"
import { IValidateService } from "../interfaces/validate-provide.interface"
import { AUTH_VALIDATION } from "../consts/auth-validation.const"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AUTH_VALIDATION)
    private readonly authValidateService: IValidateService
  ) {
    super()
  }

  async validate(username: string, passwrord: string): Promise<any> {

    const client = await this.authValidateService.validate(username, passwrord)

    return client
  }
}
