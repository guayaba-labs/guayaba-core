import { DynamicModule, Global, Module, Provider, ValueProvider } from "@nestjs/common"
import { AUTH_OPTION } from "./consts/auth-option.const"
import { IAuthConfig } from "./interfaces/auth-option.interface"
import { AuthAsyncOptions } from "./interfaces/auth-async-option.interface"
import { AuthOptionsFactory } from "./factories/auth-option.factory"
import { AuthTypeORMService } from "./service/auth-typeorm.service"
import { AUTH_VALIDATION } from "./consts/auth-validation.const"
import { AuthUseCase } from "./use-case/auth.use-case"
import { AuthController } from "./presentation/auth.controller"
import { LocalStrategy } from "./strategies/local.strategy"
import { JwtStrategy } from "./strategies/jwt-auth.strategy"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"

@Global()
@Module({})
export class AuthModule {

  public static forRoot(options: IAuthConfig): DynamicModule {

    const authOptionProvider: ValueProvider<IAuthConfig> = {
      provide: AUTH_OPTION,
      useValue: options
    }

    return {
      module: AuthModule,
      controllers: [
        //
      ],
      providers: [
        authOptionProvider
      ],
      imports: [],
      exports: []
    }
  }

  public static forRootAsync(options: AuthAsyncOptions): DynamicModule {
    const providers: Provider[] = this.createAsyncProviders(options)

    const authProviderSelection: Provider = {
      provide: AUTH_VALIDATION,
      useFactory: (authOption: IAuthConfig) => {

        switch (authOption.provide) {
          case "local":
            return AuthTypeORMService
        }

        return null
      },
      inject: [
        AUTH_OPTION
      ]
    }

    return {
      module: AuthModule,
      providers: [
        ...providers,
        ...(options.extraProviders || []),
        authProviderSelection,
        AuthUseCase,
        LocalStrategy,
        JwtStrategy,
        JwtAuthGuard
      ],
      imports: [
        PassportModule.register({
          defaultStrategy: "jwt"
        }),
        JwtModule.registerAsync({
          inject: [

          ],
          useFactory: (authOption: IAuthConfig) => {

            return {
              secret: authOption.jwtOption.jwtSecret,
              signOptions: {
                expiresIn: authOption.jwtOption.expireIn
              }
            }
          }
        }),
        ...options.imports
      ],
      exports: [
        AuthUseCase
      ],
      controllers: [
        AuthController
      ]
    }
  }

  private static createAsyncProviders(options: AuthAsyncOptions): Provider[] {

    const authOptionProvider = this.createAsyncOptionsProvider(options)

    const providers: Provider[] = [authOptionProvider]

    if (options.useClass) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      })
    }

    return providers
  }

  private static createAsyncOptionsProvider(
    options: AuthAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        name: AUTH_OPTION,
        provide: AUTH_OPTION,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      name: AUTH_OPTION,
      provide: AUTH_OPTION,
      useFactory: async (optionsFactory: AuthOptionsFactory) => {
        return optionsFactory.createAuthOptions()
      },
      inject: [options.useExisting! || options.useClass!],
    }
  }
}