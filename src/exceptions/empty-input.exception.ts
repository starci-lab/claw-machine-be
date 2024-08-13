import { HttpException, HttpStatus } from "@nestjs/common"

export class EmptyInputException extends HttpException {
    constructor() {
        super("Empty input.", HttpStatus.BAD_REQUEST)
    }
}