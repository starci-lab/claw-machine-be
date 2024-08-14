import { Column, Entity, OneToMany } from "typeorm"
import { ObjectType, Field, Float } from "@nestjs/graphql"
import { AbstractEntity } from "./abstract"
import { ClawTicketPostgresEntity } from "./claw-ticket.entity"

@ObjectType()
@Entity("account")
export class AccountPostgresEntity extends AbstractEntity {
  @Field(() => String, { nullable: true, name: "public_key" })
  @Column({ name: "public_key", type: "varchar", length: "100", unique: true })
      publicKey: string

  @Field(() => String, { nullable: true, name: "aptos_address", })
  @Column({
      name: "aptos_address",
      type: "varchar",
      length: "66",
      nullable: true,
  })
      aptosAddress?: string

  @Field(() => Float, { nullable: true,  name: "balance" })
  @Column({ name: "balance", type: "float", default: 0 })
      balance: number

  @Field(() => [ClawTicketPostgresEntity], { nullable: true, name: "claw_tickets" })
  @OneToMany(
      () => ClawTicketPostgresEntity,
      (clawTicket) => clawTicket.account,
      { nullable: true, cascade: true, onDelete: "CASCADE" },
  )
      clawTickets: Array<ClawTicketPostgresEntity>
}
