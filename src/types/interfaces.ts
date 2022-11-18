interface Base {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  deleted: boolean;
  active: boolean;
}

export interface User extends Base {
  username: string;
  password: string;
  accountId: string;
}

export interface Account extends Base {
  id: string;
  balance: number;
}

export interface Transaction extends Base {
  username: string;
  password: string;
  accountId: string;
}
