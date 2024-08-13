import { AccountPostgresEntity, ClawTicketPostgresEntity } from "@/database"
import { ClawTicketNotFoundException } from "@/exceptions"
import { ControllerServiceParams } from "@/types"
import { Injectable, Logger } from "@nestjs/common"
import { DataSource } from "typeorm"
import { TicketMathService } from "../common"

@Injectable()
export class ClawControllerService {
    private readonly logger = new Logger(ClawControllerService.name)

    constructor(
    private readonly dataSource: DataSource,
    private readonly ticketMathService: TicketMathService,
    ) {}

    public async claw({ account: { id: accountId } }: ClawParams) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()

        const clawTicket = await queryRunner.manager.findOne(
            ClawTicketPostgresEntity,
            {
                where: {
                    accountId,
                    isUsed: false,
                },
            },
        )
        if (!clawTicket) throw new ClawTicketNotFoundException()

        await queryRunner.startTransaction()
        try {
            const amount = this.ticketMathService.calculateAmountPerClaw()
            await queryRunner.manager.increment(
                AccountPostgresEntity,
                {
                    id: accountId,
                },
                "balance",
                amount,
            )
            await queryRunner.manager.update(
                ClawTicketPostgresEntity,
                clawTicket.id,
                {
                    isUsed: true,
                },
            )
            await queryRunner.commitTransaction()
        } catch (ex: unknown) {
            this.logger.error(ex)
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }
}

export type ClawParams = ControllerServiceParams