import { UserProps } from "../types/interfaces";

export class User {
  private props: UserProps;
  constructor(props: UserProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      deletedAt: props.deletedAt ?? new Date(),
    };
  }
  public get id(): string {
    return this.props.id;
  }
  public get username(): string {
    return this.props.username;
  }
  public set username(value: string) {
    this.props.username = value;
  }
  public get password(): string {
    return this.props.password;
  }
  public set password(value: string) {
    this.props.password = value;
  }
}