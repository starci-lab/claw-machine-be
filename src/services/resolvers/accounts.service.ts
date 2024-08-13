import { AccountPostgresEntity } from "@/database"
import { Injectable, Logger } from "@nestjs/common"
import { DataSource } from "typeorm"

@Injectable()
export class AccountsResolverService {
    private readonly logger = new Logger(AccountsResolverService.name)

    constructor(private readonly dataSource: DataSource) {}

    public async getAccount({ publicKey, aptosAddress }: GetAccountParams) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        try {
            const account = await queryRunner.manager.findOne(AccountPostgresEntity, {
                where: {
                    publicKey,
                    aptosAddress
                },
                relations: {
                    clawTickets: true,
                },
            })
            console.log(queryRunner)
            return account
        } finally {
            await queryRunner.release()
        }
    }
}

export type GetAccountParams = {
    publicKey?: string,
    aptosAddress?: string
}

