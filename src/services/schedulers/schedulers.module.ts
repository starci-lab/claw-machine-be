import { DailySchedulerService } from "./daily.service"
import { Module } from "@nestjs/common"

@Module({
    imports: [],
    providers: [
        DailySchedulerService
    ],
    exports: [
        DailySchedulerService
    ]
})
export class SchedulersModule {}
