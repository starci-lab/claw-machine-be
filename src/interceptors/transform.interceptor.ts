import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { Response } from "@/types"

@Injectable()
export class TransformInterceptor<Data>
implements NestInterceptor<Data, Response<Data>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<Data>> {
        const request = context.switchToHttp().getRequest()
        const message = request.body.message
        request.body.payload = JSON.parse(message)
        return next.handle()
    }
}
