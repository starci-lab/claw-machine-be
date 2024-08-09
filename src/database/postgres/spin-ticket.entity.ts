import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { ObjectType, Field } from "@nestjs/graphql"
import { AbstractEntity } from "./abstract"
import { AccountPostgresEntity } from "./account.entity"

@ObjectType()
@Entity("spin_ticket")
export class SpinTicketPostgresEntity extends AbstractEntity {
  @Field(() => String)
  @Column({ name: "is_used", type: "boolean", nullable: false, default: false })
      isUsed: boolean

  @Column({ name: "account_id", type: "uuid" })
      accountId: string
    
  @Field(() => String)
  @ManyToOne(() => AccountPostgresEntity, (account) => account.spinTickets, {onDelete : "CASCADE"})
  @JoinColumn({ name: "account_id" })
      account: AccountPostgresEntity
}
