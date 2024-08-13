import { HttpException, HttpStatus } from "@nestjs/common"

export class ChainNameNotFoundException extends HttpException {
    constructor() {
        super("Chain name not found.", HttpStatus.BAD_REQUEST)
    }
}