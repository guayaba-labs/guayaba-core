import { UserReponse } from "../domain/response/user.response"

export interface IValidateService {
  validate(username: string, password: string): Promise<UserReponse>
}