import { Queue } from "@/application/entities/queue";
import { QueueService } from "@/application/service-repositories/queue-repository";
import { HttpError } from "@/error/http";
import { Replace } from "@/common/helpers/Replace";
import { rabbitConnection } from "@/queue/rabbit";
import { Message } from "amqplib";
import { Replies } from "amqplib/properties";

export default class RabbitService implements QueueService {
  private rabbitService = rabbitConnection;
  async consume(
    queue: string,
    callback: (msg: Message) => any
  ): Promise<Replies.Consume> {
    const channel = this.rabbitService.getChannel();
    await channel.assertQueue(queue);
    const message = await channel.consume(queue, (msg: Message | null) => {
      callback(msg as Message);
      channel.ack(msg as Message);
    });
    await channel.checkQueue(queue);
    return message;
  }

  async consumeInterval(
    queue: string,
    callback: (msg: Message) => any,
    interval: number
  ): Promise<void> {
    try {
      const channel = this.rabbitService.getChannel();
      await channel.assertQueue(queue);
      const message = await channel.get(queue);
      if (message) {
        const result = await callback(message);
        channel.ack(message);
        if (result[1]) throw new HttpError(result[1].status, result[1].message);
      }
    } catch (error: any) {
      throw new HttpError(error.status, error.message);
    }
  }

  async publishInQueue({
    queue,
    payload,
  }: Replace<Queue, { exchange?: string; id?: string }>): Promise<boolean> {
    return this.rabbitService
      .getChannel()
      .sendToQueue(queue, Buffer.from(JSON.stringify(payload)));
  }

  async publishInExchange({
    exchange,
    topic,
    payload,
  }: Replace<Queue, { id?: string }>): Promise<boolean> {
    return this.rabbitService
      .getChannel()
      .publish(exchange, topic, Buffer.from(JSON.stringify(payload)));
  }
}
