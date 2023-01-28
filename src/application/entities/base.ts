import { BaseProps } from "../types/interfaces";

export class Base {
  private props: BaseProps;
  
  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  public get deleted(): boolean {
    return this.props.deleted;
  }

  public set deleted(value: boolean) {
    this.props.deleted = value;
  }

  public get active(): boolean {
    return this.props.active;
  }

  public set active(value: boolean) {
    this.props.active = value;
  }
}
