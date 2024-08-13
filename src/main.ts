import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { envConfig } from "config/env.config"
import { HttpsOptions } from "@nestjs/common/interfaces/external/https-options.interface"
import { getEnvValue } from "@/utils"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from "@nestjs/graphql"
import { AccountResolver } from "./application"
import { printSchema } from "graphql"
import { promises } from "fs"
import { join } from "path"

const generateSchema = async () => {
    const app = await NestFactory.create(GraphQLSchemaBuilderModule)
    await app.init()

    const gqlSchemaFactory = app.get(GraphQLSchemaFactory)
    const schema = await gqlSchemaFactory.create([
        AccountResolver
    ])
    
    await promises.writeFile(
        join(
            process.cwd(),
            `${getEnvValue({ development: "src", production: "dist" })}/schema.gql`,
        ),
        printSchema(schema),
    )
}

const bootstrap = async () => {
    const httpsOptions: HttpsOptions = getEnvValue({
        production: {
            cert: envConfig().ssl.cert,
            key: envConfig().ssl.key,
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

generateSchema().then(() => bootstrap())