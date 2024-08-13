import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const Payload = createParamDecorator(
    (_: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        return request.body.payload
    },
)