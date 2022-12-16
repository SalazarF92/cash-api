import { Queue } from "../entities/queue";

export abstract class QueueService {
  abstract consume(queue: string, callback: (msg: any) => any): Promise<any>;
  abstract publishInQueue(queue: Queue): Promise<any>;
  abstract publishInExchange(queue: Queue): Promise<any>;
}
