import { Test } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { envConfig } from "@/config"
import { ConfigModule } from "@nestjs/config"
import { DataSource } from "typeorm"
import { AccountPostgresEntity, ClawTicketPostgresEntity } from "@/database"
import { TicketMathService } from "../common"
import { AccountsResolverService } from "./accounts.service"

describe("AccountsResolverService", () => {
    let service: AccountsResolverService
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
            providers: [TicketMathService, AccountsResolverService],
        }).compile()

        service = module.get(AccountsResolverService)
        dataSource = module.get(DataSource)
    })

    describe("getAccount", () => {
        it("should get account sucessfully", async () => {
            const account = await dataSource.manager.save(AccountPostgresEntity, {
                publicKey: "0xcafe",
                aptosAddress: "0xc0ffee",
                clawTickets: [{}],
            })

            const { publicKey } = await service.getAccount({
                aptosAddress: "0xc0ffee"
            })

            expect(publicKey === "0xcafe")

            await dataSource.manager.delete(AccountPostgresEntity, account.id)
        })
    })
})
