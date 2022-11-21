import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Base } from "../base/base.entity";
import { User } from "./user.entity";

@Entity({ name: "accounts" })
export class Account extends Base {
  @Column({ default: 100 })
  balance: number;

  @OneToOne(() => User , (user) => user)
  @JoinColumn()
  user: User
}
