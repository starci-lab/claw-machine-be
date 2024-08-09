import { SchedulersModule } from "./schedulers"
import { Module } from "@nestjs/common"

@Module({
    imports: [
        SchedulersModule
    ],
    providers: [],
})
export class ServicesModule {}
