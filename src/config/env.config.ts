export const envConfig = () => ({
    port: process.env.PORT ?? 3672,
    nodeEnv: process.env.NODE_ENV ?? "development",
    ssl: {
        cert: process.env.SSL_CERT,
        key: process.env.SSL_KEY,
    },
    database: {
        postgres: {
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT ?? 5432),
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            mockDatabase: process.env.POSTGRES_MOCK_DATABASE,
        }
    }
})