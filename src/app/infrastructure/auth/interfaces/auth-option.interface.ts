import { ModuleMetadata, Provider, Type } from "@nestjs/common"
import { AuthOptionsFactory } from "./auth-module.interface"
import { AuthModeProvider } from "../consts/auth-provide.const"

export interface JWTAuthOption {
  jwtSecret?: string
  expireIn: string
}

export interface FirebaseConfig {
  audience: string
  issuer: string
}

export interface IAuthConfig  {
  provide: AuthModeProvider,
  authUserOption: {
    userFieldId: string
    userFieldUsername: string
    userClass: any
  }
  jwtOption: JWTAuthOption
  firebaseConfig?: FirebaseConfig
}

export interface AuthModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {

  useExisting?: Type<AuthOptionsFactory>

  useClass?: Type<AuthOptionsFactory>

  useFactory?: (...args: any[]) => Promise<IAuthConfig> | IAuthConfig

  inject?: any[]

  extraProviders?: Provider[]
}