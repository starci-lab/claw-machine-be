import { AptosService } from "./aptos.service"
import { Global, Module } from "@nestjs/common"
import { TicketMathService } from "./ticket-math.service"

@Global()
@Module({
    imports: [],
    providers: [
        AptosService,
        TicketMathService
    ],
    exports: [
        AptosService,
        TicketMathService
    ]
})
export class CommonModule {}
