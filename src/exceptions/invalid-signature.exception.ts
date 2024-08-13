import { HttpException, HttpStatus } from "@nestjs/common"

export class InvalidSignatureException extends HttpException {
    constructor() {
        super("Invalid signature.", HttpStatus.FORBIDDEN)
    }
}