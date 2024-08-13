import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { ObjectType, Field, ID } from "@nestjs/graphql"
import { AbstractEntity } from "./abstract"
import { AccountPostgresEntity } from "./account.entity"

@ObjectType()
@Entity("claw_ticket")
export class ClawTicketPostgresEntity extends AbstractEntity {
  @Field(() => Boolean, { nullable: true, name: "is_used" })
  @Column({ name: "is_used", type: "boolean", nullable: false, default: false })
      isUsed: boolean

  @Field(() => ID, { nullable: true, name: "account_id" })
  @Column({ name: "account_id", type: "uuid" })
      accountId: string

  @Field(() => AccountPostgresEntity, { nullable: true, name: "account" })
  @ManyToOne(() => AccountPostgresEntity, (account) => account.clawTickets, {
      onDelete: "CASCADE",
  })
  @JoinColumn({ name: "account_id" })
      account: AccountPostgresEntity
}
