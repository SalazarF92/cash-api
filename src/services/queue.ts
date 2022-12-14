import { rabbitConnection } from "@/queue/rabbit";
import { Message } from "amqplib";

export default class QueueService {
  private rabbitService = rabbitConnection;
  async consume(queue: string, callback: (msg: Message) => any) {
    const channel = this.rabbitService.getChannel();
    await channel.assertQueue(queue);
    const message = await channel.consume(queue, (msg) => {
      callback(msg);
      channel.ack(msg);
    });

    const listening = await channel.checkQueue(queue);
  
    console.log(listening)

    return message;
  }

  async publishInQueue(queue: string, message: string) {
    console.log(queue, message);
    return this.rabbitService
      .getChannel()
      .sendToQueue(queue, Buffer.from(message));
  }

  async publishInExchange(
    exchange: string,
    routingKey: string,
    message: string
  ): Promise<boolean> {
    return this.rabbitService
      .getChannel()
      .publish(exchange, routingKey, Buffer.from(message));
  }
}
