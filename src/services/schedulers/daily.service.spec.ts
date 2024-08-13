import { Test } from "@nestjs/testing"
import { DailySchedulerService } from "./daily.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { envConfig } from "@/config"
import { ConfigModule } from "@nestjs/config"
import { DataSource } from "typeorm"
import { AccountPostgresEntity, ClawTicketPostgresEntity } from "@/database"

describe("DailySchedulerService", () => {
    let service: DailySchedulerService
    let dataSource: DataSource

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [envConfig],
                    isGlobal: true,
                }),
                TypeOrmModule.forRoot({
                    type: "postgres",
                    host: envConfig().database.postgres.slave1.host,
                    port: envConfig().database.postgres.slave1.port,
                    username: envConfig().database.postgres.slave1.username,
                    password: envConfig().database.postgres.slave1.password,
                    database: envConfig().database.postgres.slave1.database,
                    autoLoadEntities: true,
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([
                    AccountPostgresEntity,
                    ClawTicketPostgresEntity,
                ]),
            ],
            providers: [DailySchedulerService],
        }).compile()

        service = module.get(DailySchedulerService)
        dataSource = module.get(DataSource)
    })

    describe("createClawTicket", () => {
        it("should create sucessfully", async () => {
            const { id } = await dataSource.manager.save(AccountPostgresEntity, {
                publicKey: "0xcafe1",
                aptosAddress: "0xc0ffee1",
            })
            await service.createClawTicket()
            const clawTickets = await dataSource.manager.find(
                ClawTicketPostgresEntity,
                {
                    where: {
                        accountId: id,
                        isUsed: false,
                    },
                },
            )
            expect(clawTickets.length === 1)
            await dataSource.manager.delete(AccountPostgresEntity, id)
        })
    })
})
