import { Replace } from "@/common/helpers/Replace";

export interface BaseProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  deleted: boolean;
  active: boolean;
}

export interface QueueProps
  extends Replace<
    BaseProps,
    {
      createdAt?: Date;
      deletedAt?: Date;
      updatedAt?: Date;
      deleted?: boolean;
      active?: boolean;
    }
  > {
  queue: string;
  topic: string;
  payload: Payload;
  exchange: string;
}

interface TransactionQueue {
  creditedAccount: string;
  debitedAccount: string;
  value: number;
}

export interface Payload
  extends Replace<
    BaseProps,
    {
      createdAt?: Date;
      deletedAt?: Date;
      updatedAt?: Date;
      deleted?: boolean;
      active?: boolean;
    }
  > {
  body: TransactionQueue | string;
}

export interface UserProps
  extends Replace<
    BaseProps,
    {
      createdAt?: Date;
      deletedAt?: Date;
      updatedAt?: Date;
      deleted?: boolean;
      active?: boolean;
    }
  > {
  username: string;
  password: string;
}

export interface TransactionProps
  extends Replace<
    BaseProps,
    {
      createdAt?: Date;
      deletedAt?: Date;
      updatedAt?: Date;
      deleted?: boolean;
      active?: boolean;
    }
  > {
  amount: number;
  type: string;
  description: string;
  userId: string;
}
