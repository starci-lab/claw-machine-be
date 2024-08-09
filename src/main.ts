import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { envConfig } from "config/env.config"
import { HttpsOptions } from "@nestjs/common/interfaces/external/https-options.interface"
import { getEnvValue } from "@/utils"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

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
bootstrap()
