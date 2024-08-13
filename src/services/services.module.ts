import { CommonModule } from "./common"
import { ResolversModule } from "./resolvers"
import { ControllersModule } from "./controllers"
import { SchedulersModule } from "./schedulers"
import { Module } from "@nestjs/common"

@Module({
    imports: [
        CommonModule,
        SchedulersModule,
        ControllersModule,
        ResolversModule
    ],
    providers: [],
})
export class ServicesModule {}
