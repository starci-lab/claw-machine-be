import { Test } from "@nestjs/testing"
import { DailySchedulerService } from "./daily.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { envConfig } from "@/config"
import { ConfigModule } from "@nestjs/config"
import { DataSource } from "typeorm"
import { AccountPostgresEntity, SpinTicketPostgresEntity } from "@/database"

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
                    host: envConfig().database.postgres.host,
                    port: envConfig().database.postgres.port,
                    username: envConfig().database.postgres.username,
                    password: envConfig().database.postgres.password,
                    database: envConfig().database.postgres.mockDatabase,
                    dropSchema: true,
                    autoLoadEntities: true,
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([AccountPostgresEntity, SpinTicketPostgresEntity])
            ],
            providers: [
                DailySchedulerService
            ]
        }).compile()
        
        service = module.get(DailySchedulerService)
        dataSource = module.get(DataSource)
    })
  
    describe("createSpinTicket", () => {
        it("should create sucessfully", async () => {
            const { id } = await dataSource.manager.save(AccountPostgresEntity, {
                address: "0xc0ffee"
            })
            await service.createSpinTicket()  
            const spinTickets = await dataSource.manager.find(SpinTicketPostgresEntity, {
                where: {
                    accountId: id,
                    isUsed: false
                }
            })
            expect(spinTickets.length === 1)
        })
    })
})
  