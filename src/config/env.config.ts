export enum NodeEnv {
    Production = "production",
    Development = "development",
}

export const envConfig = () => ({
    port: process.env.PORT ?? 3672,
    nodeEnv: (process.env.NODE_ENV ?? NodeEnv.Development) as NodeEnv,
    ssl: {
        cert: process.env.SSL_CERT,
        key: process.env.SSL_KEY,
    },
    database: {
        postgres: {
            master: {
                host: process.env.POSTGRES_MASTER_HOST,
                port: Number(process.env.POSTGRES_MASTER_PORT ?? 5432),
                username: process.env.POSTGRES_MASTER_USERNAME,
                password: process.env.POSTGRES_MASTER_PASSWORD,
                database: process.env.POSTGRES_MASTER_DATABASE,
                mockDatabase: process.env.POSTGRES_MASTER_MOCK_DATABASE,
            },
            slave1: {
                host: process.env.POSTGRES_SLAVE_1_HOST,
                port: Number(process.env.POSTGRES_SLAVE_1_PORT ?? 5433),
                username: process.env.POSTGRES_SLAVE_1_USERNAME,
                password: process.env.POSTGRES_SLAVE_1_PASSWORD,
                database: process.env.POSTGRES_SLAVE_1_DATABASE,
                mockDatabase: process.env.POSTGRES_SLAVE_1_MOCK_DATABASE,
            }
        }
    }
})