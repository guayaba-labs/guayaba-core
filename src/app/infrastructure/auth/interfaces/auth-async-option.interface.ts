import { ModuleMetadata, Provider, Type } from "@nestjs/common"
import { AuthOptionsFactory } from "../factories/auth-option.factory"
import { IAuthConfig } from "./auth-option.interface"

export interface AuthAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  inject?: any[]
  useClass?: Type<AuthOptionsFactory>
  useExisting?: Type<AuthOptionsFactory>
  useFactory?: (...args: any[]) => Promise<IAuthConfig> | IAuthConfig
  extraProviders?: Provider[]
}