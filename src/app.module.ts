import { Module, ValidationPipe } from "@nestjs/common"
import { ApolloDriverConfig, ApolloDriver } from "@nestjs/apollo"
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { GraphQLModule } from "@nestjs/graphql"
import { ConfigModule } from "@nestjs/config"
import { envConfig } from "@/config"
import { APP_PIPE } from "@nestjs/core"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ApplicationModule } from "./application"
import { ServicesModule } from "./services"

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [envConfig],
            isGlobal: true,
        }),

        TypeOrmModule.forRoot({
            type: "postgres",
            host: envConfig().database.postgres.host,
            port: envConfig().database.postgres.port,
            username: envConfig().database.postgres.username,
            password: envConfig().database.postgres.password,
            database: envConfig().database.postgres.database,
            autoLoadEntities: true,
            synchronize: true,
        }),

        // GraphQLModule.forRoot<ApolloDriverConfig>({
        //     driver: ApolloDriver,
        //     typePaths: ["./**/*.gql"],
        //     playground: false,
        //     plugins: [ApolloServerPluginLandingPageLocalDefault()],
        //     introspection: true,
        // }),

        ApplicationModule,
        ServicesModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class AppModule {}
