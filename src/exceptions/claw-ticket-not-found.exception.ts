import { HttpException, HttpStatus } from "@nestjs/common"

export class ClawTicketNotFoundException extends HttpException {
    constructor() {
        super("Claw ticket not found.", HttpStatus.NOT_FOUND)
    }
}