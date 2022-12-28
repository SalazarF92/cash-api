import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Account } from "./account.entity";
import { Base } from "./base/base.entity";

@Entity({ name: "transactions" })
export class Transaction extends Base {
  @Column({ name: "debited_account"})
  debitedAccount: string;

  @Column({ name: "credited_account"})
  creditedAccount: string;

  @Column({ nullable: false })
  value: number;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => Account, (account) => account.id)
  @JoinColumn({ name: "debited_account" })
  @JoinColumn({ name: "credited_account" })
  account: Account;
}
