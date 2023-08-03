import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AUTH_OPTIONS } from "../consts/auth-option.const";
import { IAuthConfig } from "../interfaces/auth-option.interface";
import { passportJwtSecret } from "jwks-rsa";

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor(
    @Inject(AUTH_OPTIONS)
    private readonly authOption: IAuthConfig
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
      }),
      issuer: authOption.firebaseConfig ? authOption.firebaseConfig.issuer : null,
      audience: authOption.firebaseConfig ? authOption.firebaseConfig.audience : null,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
    });
  }

  validate(payload): any | Promise<any> {
    return payload;
  }
}