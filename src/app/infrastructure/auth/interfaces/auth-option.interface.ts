import { ModuleMetadata, Provider, Type } from "@nestjs/common"
import { AuthOptionsFactory } from "./auth-module.interface"

export interface JWTAuthOption {
  jwtSecret?: string
  expireIn: string
}

export interface IAuthConfig  {
  provide: "local" | "firebase" | "keycloak"
  authUserOption: {
    userFieldId: string
    userFieldUsername: string
    userClass: any
  }
  jwtOption: JWTAuthOption
}

export interface AuthModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {

  useExisting?: Type<AuthOptionsFactory>

  useClass?: Type<AuthOptionsFactory>

  useFactory?: (...args: any[]) => Promise<IAuthConfig> | IAuthConfig

  inject?: any[]

  extraProviders?: Provider[]
}