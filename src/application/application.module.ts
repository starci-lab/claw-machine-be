import { Module } from "@nestjs/common"
import { SchedulersModule } from "./schedulers"

@Module({
    imports: [
        SchedulersModule
    ],
    controllers: [],
    providers: [],
})
export class ApplicationModule {}
