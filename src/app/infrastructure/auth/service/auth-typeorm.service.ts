import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { DataSource } from "typeorm"
import { InjectDataSource } from "@nestjs/typeorm"
import * as bcrypt from "bcrypt"

import { AUTH_OPTIONS } from "../consts/auth-option.const"
import { UserReponse } from "../domain/response/user.response"
import { IValidateService } from "../interfaces/validate-provide.interface"
import { IAuthConfig } from "../interfaces/auth-option.interface"

@Injectable()
export class AuthTypeORMService implements IValidateService {

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(AUTH_OPTIONS)
    private readonly authOption: IAuthConfig
  ) {
    //
  }

  async validate(username: string, password: string): Promise<UserReponse> {

    if (!this.authOption.authUserOption.userClass)
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: `User Object is not defined in your options`,
      }, HttpStatus.FORBIDDEN, {
        cause: `User Object is not defined in your options`
      })

    const user = await this.dataSource.createQueryBuilder(this.authOption.authUserOption.userClass, "us")
      .where(`us.${this.authOption.authUserOption.userFieldUsername} = :username`, {
        username: username
      })
      .getOne()

    if (!user)
      throw new UnauthorizedException(`User does not exists!`)

    const valid = await bcrypt.compare(password, user.password)

    if (!valid)
      throw new UnauthorizedException(`Invalid Credentials!`)


    return <UserReponse>{
      ...user
    }
  }
}