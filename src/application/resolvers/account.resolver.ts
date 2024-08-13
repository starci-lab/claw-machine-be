
import { AccountPostgresEntity } from "@/database"
import { AccountsResolverService, GetAccountInput } from "@/services"
import { Args, Query, Resolver } from "@nestjs/graphql"
import { UseGuards } from "@nestjs/common"
import { EmptyInputGuard } from "@/guards"

@Resolver()
export class AccountResolver {
    constructor(private readonly accountResolverService: AccountsResolverService) {}

    @UseGuards(EmptyInputGuard)
    @Query(() => AccountPostgresEntity, {
        name: "account",
        nullable: true
    })
    async getAccount(
        @Args("input") input: GetAccountInput
    ) {
        return this.accountResolverService.getAccount(input)
    }
}
