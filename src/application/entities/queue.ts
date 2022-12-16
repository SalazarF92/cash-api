import { Message, QueueProps } from "../types/interfaces";

export class Queue {
  private props: QueueProps;
  constructor(props: QueueProps) {
    this.props = {
      ...props,
      message: props.message,
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

  public get message(): Message {
    return this.props.message;
  }

  public set message(value: Message) {
    this.props.message = value;
  }
}
