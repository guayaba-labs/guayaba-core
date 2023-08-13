import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { DataSource } from "typeorm"
import { InjectDataSource } from "@nestjs/typeorm"
import * as bcrypt from "bcrypt"
import { camelCase } from "change-case"

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

    const queryBase = this.dataSource.createQueryBuilder(this.authOption.authUserOption.userClass, "us")

    const plainQuery = this.authOption.authUserOption.aggregates
      ? this.authOption.authUserOption.aggregates(queryBase) : queryBase

    const userQuery = await plainQuery
      .where(`us.${this.authOption.authUserOption.userFieldUsername} = :username`, {
        username: username
      })
      .getRawOne()

    if (!userQuery)
      throw new UnauthorizedException(`User does not exists!`)

    let entityMapper: any = {}

    const columns = Object.keys(userQuery)

    columns.forEach((it) => {

      const removePrefix = camelCase(it.replace(`us_`, ""))
      const el = userQuery[it]

      entityMapper = {
        ...entityMapper,
        [removePrefix]: el
      }
    })


    const valid = await bcrypt.compare(password, entityMapper.password)

    if (!valid)
      throw new UnauthorizedException(`Invalid Credentials!`)

    return <UserReponse>{
      ...entityMapper
    }
  }
}