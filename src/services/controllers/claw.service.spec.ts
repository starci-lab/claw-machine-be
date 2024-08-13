import { Test } from "@nestjs/testing"
import { ClawControllerService } from "./claw.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { envConfig } from "@/config"
import { ConfigModule } from "@nestjs/config"
import { DataSource } from "typeorm"
import { AccountPostgresEntity, ClawTicketPostgresEntity } from "@/database"
import { TicketMathService } from "../common"

describe("ClawControllerService", () => {
    let service: ClawControllerService
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
                    host: envConfig().database.postgres.master.host,
                    port: envConfig().database.postgres.master.port,
                    username: envConfig().database.postgres.master.username,
                    password: envConfig().database.postgres.master.password,
                    database: envConfig().database.postgres.master.mockDatabase,
                    autoLoadEntities: true,
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([
                    AccountPostgresEntity,
                    ClawTicketPostgresEntity,
                ]),
            ],
            providers: [TicketMathService, ClawControllerService],
        }).compile()

        service = module.get(ClawControllerService)
        dataSource = module.get(DataSource)
    })

    describe("claw", () => {
        it("should claw sucessfully", async () => {
            const account = await dataSource.manager.save(AccountPostgresEntity, {
                publicKey: "0xcafe",
                aptosAddress: "0xc0ffee",
                clawTickets: [{}],
            })
            await service.claw({
                account,
            })
            const clawTickets = await dataSource.manager.find(
                ClawTicketPostgresEntity,
                {
                    where: {
                        accountId: account.id,
                        isUsed: true,
                    },
                },
            )
            expect(clawTickets.length === 0)

            const { balance } = await dataSource.manager.findOne(
                AccountPostgresEntity,
                {
                    where: {
                        id: account.id,
                    },
                },
            )
            expect(balance >= 0)
            await dataSource.manager.delete(AccountPostgresEntity, account.id)
        })
    })
})
