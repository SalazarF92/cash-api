import { Queue } from "@/application/entities/queue";
import { QueueService } from "@/application/repositories/queue-repository";
import { Replace } from "@/helpers/Replace";
import { rabbitConnection } from "@/queue/rabbit";
import { Message } from "amqplib";
import { Replies } from "amqplib/properties";

export default class RabbitService implements QueueService {
  private rabbitService = rabbitConnection;
  async consume(queue: string, callback: (msg: Message) => any): Promise<Replies.Consume> {
    const channel = this.rabbitService.getChannel();
    await channel.assertQueue(queue);
    const message = await channel.consume(queue, (msg: Message | null) => {
      callback(msg as Message);
      channel.ack(msg as Message);
    });
    await channel.checkQueue(queue);
    return message;
  }

  async publishInQueue({
    queue,
    message,
  }: Replace<Queue, { exchange?: string; id?: string }>): Promise<boolean> {
    console.log(queue, message.body);
    return this.rabbitService
      .getChannel()
      .sendToQueue(queue, Buffer.from(message.body));
  }

  async publishInExchange({
    exchange,
    topic,
    message,
  }: Replace<Queue, { id?: string }>): Promise<boolean> {
    return this.rabbitService
      .getChannel()
      .publish(exchange, topic, Buffer.from(message.body));
  }
}
