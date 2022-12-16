// import { Connection } from "@eduzz/rabbit";
import { DSN_RABBIT } from "@/settings";
import { Connection, Channel, connect } from "amqplib";

class RabbitConnection {
  private connection: Connection;
  private channel: Channel;

  public async initialize(): Promise<void> {
    this.connection = await connect(DSN_RABBIT);
    this.channel = await this.connection.createChannel();
    console.log("RabbitService initialized")
  }

  public getConnection(): Connection {
    return this.connection;
  }

  public getChannel(): Channel {
    return this.channel;
  }
 
}

export const rabbitConnection = new RabbitConnection();
