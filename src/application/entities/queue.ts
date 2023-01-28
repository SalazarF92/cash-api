import { Payload, QueueProps } from "../types/interfaces";

export class Queue {
  private props: QueueProps;
  constructor(props: QueueProps) {
    this.props = {
      ...props,
      payload: props.payload,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      deletedAt: props.deletedAt ?? new Date(),
    };
  }

  public get id(): string {
    return this.props.id;
  }

  public get queue(): string {
    return this.props.queue;
  }
  
  public set queue(value: string) {
    this.props.queue = value;
  }
  
    public get exchange(): string {
      return this.props.exchange;
    }

  public set topic(value: string) {
    this.props.topic = value;
  }

  public get topic(): string {
    return this.props.topic;
  }

  public get payload(): Payload {
    return this.props.payload;
  }

  public set payload(value: Payload) {
    this.props.payload = value;
  }
}
