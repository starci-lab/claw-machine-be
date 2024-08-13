import { AccountPostgresEntity, ClawTicketPostgresEntity } from "@/database"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccountsResolverService } from "./accounts.service"
import { Global, Module } from "@nestjs/common"

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountPostgresEntity,
            ClawTicketPostgresEntity,
        ]),
    ],
    providers: [
        AccountsResolverService
    ],
    exports: [
        AccountsResolverService
    ]
})
export class ResolversModule {}
