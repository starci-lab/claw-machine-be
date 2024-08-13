import { Injectable } from "@nestjs/common"

@Injectable()
export class TicketMathService {
    constructor() {}
    public calculateAmountPerClaw() {
        return Math.random() * 60 + 40
    }
}