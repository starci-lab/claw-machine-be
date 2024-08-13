import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const Account = createParamDecorator(
    (_: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        return request.account
    },
)