import { AccountPostgresEntity } from "@/database"

export interface SignedMessage {
  message: string;
  publicKey: string;
  signature: string;
  chainName: ChainName;
}

export interface Response<Data> {
  message: string;
  data: Data;
}

export enum ChainName {
  Aptos = "aptos",
}

export interface ControllerServiceParams<Payload = undefined> {
  payload?: Payload;
  account: AccountPostgresEntity;
}