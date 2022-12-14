import { rabbitConnection } from "@/queue/rabbit";
import { Message } from "amqplib";

export default class QueueService {
  private rabbitService = rabbitConnection;
  constructor() {}

  // public async publish(message: any) {
  //   try {
  //     const publisher = this.rabbitService.getConnection().topic("transaction.info").persistent(true);
  //     const payload = {
  //       message,
  //     };
  //     await publisher.send({
  //       payload,
  //     });
  //     return true;
  //   } catch (error) {
  //    return error
  //   }
  // }

  // public async consume() {
  //   async () => {
  //     const consumer = this.rabbitService
  //       .getConnection()
  //       .queue("transaction")
  //       .topic("transaction")
  //       .durable()
  //       .retryTimeout(60000)
  //       .listen<string>(async (msg) => {
  //         console.log(msg);
  //         return true;
  //       });
  //     return consumer;
  //   };
  // }

  async consume(queue: string, callback: (msg: Message) => any) {
    const channel = this.rabbitService.getChannel();
    await channel.assertQueue(queue);
    const message = await channel.consume(queue, (msg) => {
      callback(msg);
      channel.ack(msg);
    });

    //condition if queue is empty
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
