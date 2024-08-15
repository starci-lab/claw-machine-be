import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { envConfig } from "config/env.config"
import { HttpsOptions } from "@nestjs/common/interfaces/external/https-options.interface"
import { getEnvValue } from "@/utils"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import {
    GraphQLSchemaBuilderModule,
    GraphQLSchemaFactory,
} from "@nestjs/graphql"
import { AccountResolver } from "./application"
import { printSchema } from "graphql"
import { promises, readFileSync } from "fs"
import { join } from "path"
import { DataSource } from "typeorm"

const generateSchema = async () => {
    const app = await NestFactory.create(GraphQLSchemaBuilderModule)
    await app.init()

    const gqlSchemaFactory = app.get(GraphQLSchemaFactory)
    const schema = await gqlSchemaFactory.create([AccountResolver])

    await promises.writeFile(
        join(
            process.cwd(),
            `${getEnvValue({ development: "src", production: "dist" })}/schema.gql`,
        ),
        printSchema(schema),
    )
}

const createDatabases = async () => {
    const master = new DataSource({
        type: "postgres",
        host: envConfig().database.postgres.master.host,
        port: envConfig().database.postgres.master.port,
        username: envConfig().database.postgres.master.username,
        password: envConfig().database.postgres.master.password,
    })

    const slaves: Array<DataSource> = [
        new DataSource({
            type: "postgres",
            host: envConfig().database.postgres.slave1.host,
            port: envConfig().database.postgres.slave1.port,
            username: envConfig().database.postgres.slave1.username,
            password: envConfig().database.postgres.slave1.password,
        }),
    ]

    const promises: Array<Promise<void>> = []

    promises.push(
        (async () => {
            const dataSource = await master.initialize()
            await dataSource
                .createQueryRunner()
                .createDatabase(envConfig().database.postgres.master.database, true)
        })(),
    )

    promises.push(
        (async () => {
            const dataSource = await slaves.at(0).initialize()
            await dataSource
                .createQueryRunner()
                .createDatabase(envConfig().database.postgres.slave1.database, true)
        })(),
    )

    await Promise.all(promises)
}

const bootstrap = async () => {
    const httpsOptions: HttpsOptions = getEnvValue({
        production: {
            cert:
        envConfig().ssl.cert ??
        readFileSync(`${process.cwd()}/ssl/cert.pem`, "utf-8"),
            key:
        envConfig().ssl.key ??
        readFileSync(`${process.cwd()}/ssl/key.pem`, "utf-8"),
        },
    })

    const app = await NestFactory.create(AppModule, {
        httpsOptions,
    })

    app.enableCors()

    const config = new DocumentBuilder()
        .setVersion("1.0")
        .addBearerAuth()
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("/api", app, document)

    await app.listen(envConfig().port)
}

generateSchema()
    .then(() => createDatabases()
        .then(() => bootstrap()
        )
    )
