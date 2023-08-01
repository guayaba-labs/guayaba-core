
import { Inject, Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { AUTH_OPTION } from "../consts/auth-option.const"
import { IAuthConfig } from "../interfaces/auth-option.interface"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @Inject(AUTH_OPTION)
    private readonly authOption: IAuthConfig
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authOption.jwtOption.jwtSecret,
    })
  }

  async validate(payload: any): Promise<any> {
    return payload
  }
}
