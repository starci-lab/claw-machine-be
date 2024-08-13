import { GqlExecutionContext } from "@nestjs/graphql"
import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common"
import { EmptyInputException } from "@/exceptions"
import { isEmpty } from "lodash" 

@Injectable()
export class EmptyInputGuard implements CanActivate {
    constructor() {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context).getContext()
        const { input } = ctx.req.body.variables

        if (isEmpty(input)) throw new EmptyInputException()
            
        return true
    }
}
