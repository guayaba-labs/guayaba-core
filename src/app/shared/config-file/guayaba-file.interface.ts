import { GuayabaMode } from "../enums/mode.enum"

export interface IOrmOptions {
  orm: "typeorm" | "mongoose",
  database: "postgres" | "mysql" | "mongodb"
}

export interface IAuthOptions {
  strategy: "local" | "firebase" | "keycloak"
}

export interface IGuayabaConfig {
  mode: GuayabaMode
  ormOptions: IOrmOptions
  authOptions: IAuthOptions
}

