import { envConfig } from "@/config"
import { Logger } from "kafkajs"
import { DataSource, QueryRunner } from "typeorm"

export const getEnvValue = <ValueType = string>(values: {
  development?: ValueType;
  production?: ValueType;
}): ValueType => {
    const { development, production } = values
    switch (envConfig().nodeEnv) {
    case "production":
        return production
    default:
        return development
    }
}

export const createQueryRunner = async <MainFnReturn, AfterConnectFnReturn>(
    mainFn?: (queryRunner: QueryRunner) => Promise<MainFnReturn>,
    logger?: Logger,
    afterConnectFn?: (queryRunner: QueryRunner) => Promise<AfterConnectFnReturn>,
    queryRunner?: QueryRunner,
    dataSource?: DataSource,
) => {
    if (!queryRunner) {
        queryRunner = dataSource.createQueryRunner()
        await queryRunner.connect()
        await afterConnectFn(queryRunner)

        await queryRunner.startTransaction()
        try {
            await mainFn(queryRunner)
        } catch (ex: unknown) {
            logger.error(ex.toString())
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    } else {
        await mainFn(queryRunner)
    }   
}
