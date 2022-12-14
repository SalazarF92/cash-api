// import { Connection } from "@eduzz/rabbit";
import { Connection, Channel, connect, Message } from "amqplib";

class RabbitConnection {
  private connection: Connection;
  private channel: Channel;

  public async initialize(): Promise<void> {
    // console.log("RabbitService initialized");
    // this.connection = this.createConnection();
    this.connection = await connect("amqps://ltthzpmd:3w0T0lIXLCEv3he4dy0mGglnxrc5T17I@moose.rmq.cloudamqp.com/ltthzpmd");
    this.channel = await this.connection.createChannel();
    console.log("RabbitService initialized")
  }

  public getConnection(): Connection {
    return this.connection;
  }

  public getChannel(): Channel {
    return this.channel;
  }

  // public createConnection(name?: string) {
  //   return new Connection({
  //     connectionName: `cash-dev`,
  //     dsn: "amqps://ltthzpmd:3w0T0lIXLCEv3he4dy0mGglnxrc5T17I@moose.rmq.cloudamqp.com/ltthzpmd",
  //     exchange: "ngcash",
  //     exchangeType: "topic",
  //   });
  // }

  
}

export const rabbitConnection = new RabbitConnection();
