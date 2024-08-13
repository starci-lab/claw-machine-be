import { SignedMessage } from "@/types"
import {
    Aptos,
    AptosConfig,
    Ed25519PublicKey,
    Ed25519Signature,
    Network,
} from "@aptos-labs/ts-sdk"
import { Injectable } from "@nestjs/common"

@Injectable()
export class AptosService {
    constructor() {}

    public verifyMessage({ message, signature, publicKey }: Omit<SignedMessage, "chainName">) {
        const ed25519PublicKey = new Ed25519PublicKey(publicKey)
        const result = ed25519PublicKey.verifySignature({
            message,
            signature: new Ed25519Signature(signature),
        })
        return !!result
    }
}

export const getAptos = (network: Network) =>
    new Aptos(
        new AptosConfig({
            network,
        }),
    )