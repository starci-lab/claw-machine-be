import { Module, ValidationPipe } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { NodeEnv, envConfig } from "@/config"
import { APP_PIPE } from "@nestjs/core"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ApplicationModule } from "./application"
import { ServicesModule } from "./services"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloDriverConfig, ApolloDriver } from "@nestjs/apollo"
import {
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default"

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [envConfig],
            isGlobal: true,
        }),

        TypeOrmModule.forRoot({
            type: "postgres",
            autoLoadEntities: true,
            synchronize: true,
            replication: {
                master: {
                    host: envConfig().database.postgres.master.host,
                    port: envConfig().database.postgres.master.port,
                    username: envConfig().database.postgres.master.username,
                    password: envConfig().database.postgres.master.password,
                    database: envConfig().database.postgres.master.database,
                },
                slaves: [
                    {
                        host: envConfig().database.postgres.slave1.host,
                        port: envConfig().database.postgres.slave1.port,
                        username: envConfig().database.postgres.slave1.username,
                        password: envConfig().database.postgres.slave1.password,
                        database: envConfig().database.postgres.slave1.database,
                    },
                ],
            },
        }),

        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            typePaths: ["./**/*.gql"],
            playground: false,
            plugins: [
                envConfig().nodeEnv === NodeEnv.Production
                    ? ApolloServerPluginLandingPageProductionDefault()
                    : ApolloServerPluginLandingPageLocalDefault(),
            ],
            introspection: true,
        }),

        ServicesModule,
        ApplicationModule,
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
