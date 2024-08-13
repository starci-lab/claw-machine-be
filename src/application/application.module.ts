import { Module } from "@nestjs/common"
import { SchedulersModule } from "./schedulers"
import { ResolversModule } from "./resolvers"

@Module({
    imports: [
        SchedulersModule,
        ResolversModule
    ],
    controllers: [],
    providers: [],
})
export class ApplicationModule {}
