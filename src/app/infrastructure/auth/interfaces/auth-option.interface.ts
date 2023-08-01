export interface JWTAuthOption {
  jwtSecret: string
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