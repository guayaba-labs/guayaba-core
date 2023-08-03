export interface JWTUserPayload {
  [key: string]: any
  iat?: number
  exp?: number
}