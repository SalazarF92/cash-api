import { Matches, MinLength } from "class-validator";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Account } from "./account";
import { Base } from "./base/base.entity";

@Entity({ name: "users" })
export class User extends Base {
  @MinLength(3)
  @Column()
  username: string;

  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])/, {
    message: "Password must contain at least 1 capital letter and 1 number",
  })
  @Column()
  password: string;

  @Column({ name: "account_id", nullable: true })
  accountId: string;

  @OneToOne(() => Account, (account) => account.id)
  @JoinColumn({ name: "account_id" })
  account: Account;
}
