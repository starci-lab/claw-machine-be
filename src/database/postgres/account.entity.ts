import { Column, Entity, OneToMany } from "typeorm"
import { ObjectType, Field } from "@nestjs/graphql"
import { AbstractEntity } from "./abstract"
import { SpinTicketPostgresEntity } from "./spin-ticket.entity"

@ObjectType()
@Entity("account")
export class AccountPostgresEntity extends AbstractEntity {
  @Field(() => String)
  @Column({ name: "string", type: "varchar", length: "66", nullable: false })
      address: string
  
  @Field(() => [SpinTicketPostgresEntity])
  @OneToMany(() => SpinTicketPostgresEntity, (spinTicket) => spinTicket.account, { nullable: true })
      spinTickets?: Array<SpinTicketPostgresEntity>
}
