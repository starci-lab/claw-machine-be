import { AccountPostgresEntity } from "@/database"
import { ChainNameNotFoundException, InvalidSignatureException } from "@/exceptions"
import { AptosService } from "@/services"
import { ChainName, SignedMessage } from "@/types"
import { Ed25519PublicKey } from "@aptos-labs/ts-sdk"
import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common"
import { DataSource } from "typeorm"

@Injectable()
export class SignatureVerificationGuard implements CanActivate {
    constructor(
        private readonly aptosService: AptosService,
        private readonly dataSource: DataSource
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const { message, publicKey, signature, chainName } = request.body as SignedMessage
        if (chainName === ChainName.Aptos) {
            const verified = this.aptosService.verifyMessage({
                message,
                signature,
                publicKey
            })
            if (!verified) throw new InvalidSignatureException()
            const aptosAddress = new Ed25519PublicKey(publicKey).authKey().data.toString()    
            
            let account = await this.dataSource.manager.findOne(AccountPostgresEntity, {
                where: {
                    publicKey
                }
            })
            if (!account) {
                account = await this.dataSource.manager.save(AccountPostgresEntity, {
                    publicKey,
                    aptosAddress
                })
            } else {
                await this.dataSource.manager.update(AccountPostgresEntity, account.id, {
                    aptosAddress
                })
            }

            request.account = account
        }
        throw new ChainNameNotFoundException()
    }
}   