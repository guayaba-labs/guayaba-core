import { DynamicModule, Global, Module, Provider } from "@nestjs/common"
import { AUTH_OPTIONS } from "./consts/auth-option.const"
import { AuthModuleAsyncOptions, IAuthConfig } from "./interfaces/auth-option.interface"
import { AuthTypeORMService } from "./service/auth-typeorm.service"
import { AUTH_SERVICE } from "./consts/auth-validation.const"
import { AuthUseCase } from "./use-case/auth.use-case"
import { AuthController } from "./presentation/auth.controller"
import { LocalStrategy } from "./strategies/local.strategy"
import { JwtStrategy } from "./strategies/jwt-auth.strategy"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { AuthOptionsFactory } from "./interfaces/auth-module.interface"
import { JWT_SECRET } from "./consts/jwt-constant.const"
import { FirebaseStrategy } from "./strategies/firebase-auth.strategy"
import { AuthModeProvider } from "./consts/auth-provide.const"

@Global()
@Module({})
export class AuthModule {

  public static forRoot(options: IAuthConfig, config: { imports: any[] }): DynamicModule {

    const AuthOptionProvider = {
      provide: AUTH_OPTIONS,
      useValue: options,
    };

    const serviceProviders: { local: Provider, firebase: Provider } =  {
      local: {
        provide: AUTH_SERVICE,
        useClass: AuthTypeORMService
      },
      firebase: {
        provide: AUTH_SERVICE,
        useClass: AuthTypeORMService
      }
    }

    const ServiceAuthProvider = serviceProviders[options.provide]

    const defaultStrategy = {
      [AuthModeProvider.LOCAL]: "jwt",
      [AuthModeProvider.FIREBASE]: "firebase",
    }

    return {
      module: AuthModule,
      imports: [
        PassportModule.register({
          defaultStrategy: defaultStrategy[options.provide]
        }),
        JwtModule.register({
          secret: options.jwtOption.jwtSecret ?? JWT_SECRET,
          signOptions: { expiresIn: options.jwtOption.expireIn ?? '1day' },
        }),
        ...config.imports
      ],
      exports: [AuthOptionProvider, ServiceAuthProvider, PassportModule],
      providers: [
        AuthOptionProvider,
        ServiceAuthProvider,
        AuthUseCase,
        LocalStrategy,
        JwtStrategy,
        JwtAuthGuard,
        FirebaseStrategy
      ],
      controllers: [
        AuthController
      ]
    }
  }

  public static forRootAsync(optionAsync: AuthModuleAsyncOptions): DynamicModule {

    const ServiceAuthProvider = {
      provide: AUTH_SERVICE,
      useFactory: (options) => {

        const factoryImpl = {
          "local": AuthTypeORMService
        }

        return factoryImpl[options.provide]
      },
      inject: [
        AUTH_OPTIONS
      ]
    }

    return {
      module: AuthModule,
      imports: [
        PassportModule.register({
          defaultStrategy: "jwt"
        }),
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: '1day' },
        }),
        ...optionAsync.imports
      ],
      controllers: [AuthController],
      providers: [
        ...this.createAsyncProviders(optionAsync),
        ServiceAuthProvider,
        AuthTypeORMService,
        AuthUseCase,
        LocalStrategy,
        JwtStrategy,
        JwtAuthGuard,
        ...(optionAsync.extraProviders || [])
      ],
      exports: [ServiceAuthProvider, AuthUseCase, AuthTypeORMService, JwtAuthGuard],
    }
  }

  private static createAsyncProviders(optionAsync: AuthModuleAsyncOptions): Provider[] {
    if (optionAsync.useExisting || optionAsync.useFactory)
      return [this.createAsyncOptionsProvider(optionAsync)]

    return [
      this.createAsyncOptionsProvider(optionAsync),
      {
        provide: optionAsync.useClass,
        useClass: optionAsync.useClass
      }
    ]
  }

  private static createAsyncOptionsProvider(optionAsync: AuthModuleAsyncOptions): Provider {

    if (optionAsync.useFactory)
      return {
        provide: AUTH_OPTIONS,
        useFactory: optionAsync.useFactory,
        inject: optionAsync.inject || []
      }

    return {
      provide: AUTH_OPTIONS,
      useFactory: async (optionFactory: AuthOptionsFactory) => optionFactory.createAuthOptionFactory(),
      inject: [
        optionAsync.useExisting || optionAsync.useClass
      ]
    }
  }

}