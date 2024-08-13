import { ChainName, SignedMessage, Response } from "@/types"
import { ApiProperty } from "@nestjs/swagger"
import { IsHexadecimal } from "class-validator"

export class ClawRequestBody implements SignedMessage {
    @ApiProperty()
        message: string
    @IsHexadecimal()
    @ApiProperty()
        publicKey: string
    @IsHexadecimal()
    @ApiProperty()
        signature: string
    @ApiProperty()
        chainName: ChainName
}

export class ClawResponseData {
    @ApiProperty()
        amount: string
}

export class ClawResponse implements Response<ClawResponseData> {
    @ApiProperty()
        message: string
    @ApiProperty()
        data: ClawResponseData
}
