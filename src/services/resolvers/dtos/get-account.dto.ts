import { InputType, Field } from "@nestjs/graphql"
import { IsHexadecimal, IsOptional } from "class-validator"

@InputType()
export class GetAccountInput {
    @IsHexadecimal()
    @IsOptional()
    @Field(() => String, {
        name: "public_key",
        nullable: true
    })
        publicKey?: string
    @IsHexadecimal()
    @IsOptional()
    @Field(() => String, {
        name: "aptos_address",
        nullable: true
    })
        aptosAddress?: string
}