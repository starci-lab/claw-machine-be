import { Module } from "@nestjs/common"
import { ClawControllerService } from "./claw.service"
import { AccountPostgresEntity, ClawTicketPostgresEntity } from "@/database"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountPostgresEntity,
            ClawTicketPostgresEntity,
        ]),
    ],
    providers: [
        ClawControllerService
    ],
    exports: [
        ClawControllerService
    ]
})
export class ControllersModule {}
