import { AccountPostgresEntity, ClawTicketPostgresEntity } from "@/database"
import { Injectable, Logger } from "@nestjs/common"
import { DataSource, DeepPartial } from "typeorm"

@Injectable()
export class DailySchedulerService {
    private readonly logger = new Logger(DailySchedulerService.name)

    constructor(private dataSource: DataSource) {}

    public async createClawTicket() {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        
        const accounts = await queryRunner.manager.find(AccountPostgresEntity)
        await queryRunner.startTransaction()
        try { 
            const clawTickets: Array<DeepPartial<ClawTicketPostgresEntity>> = accounts.map(({ id }) => ({
                accountId: id,
            }))
            await queryRunner.manager.save(ClawTicketPostgresEntity, clawTickets)

            await queryRunner.commitTransaction()
        } catch (ex: unknown) {
            this.logger.error(ex)
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }
}