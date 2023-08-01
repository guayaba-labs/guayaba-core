import { IAuthConfig } from "../interfaces/auth-option.interface"

export interface AuthOptionsFactory {
  createAuthOptions(): Promise<IAuthConfig> | IAuthConfig
}
