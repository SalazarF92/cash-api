import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Base } from "../base/base.entity";

@Entity({ name: "accounts" })
export class Account extends Base {
  @Column({ default: 100 })
  balance: number;
}
