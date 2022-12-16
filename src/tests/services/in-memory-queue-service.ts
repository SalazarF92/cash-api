import { Queue } from "@/application/entities/queue";
import { QueueService } from "@/application/repositories/queue-repository";
import { Replace } from "@/helpers/Replace";

export class InMemoryQueueService implements QueueService {
  private queue: Partial<Queue>[] = [];

  async consume({ message }: Queue, callback: (msg: any) => any): Promise<any> {
    this.queue.shift();
    return callback(message.body);
  }

  async publishInQueue(
    queue: Replace<Queue, { exchange?: string }>
  ): Promise<Replace<Queue, { exchange?: string }>> {
    this.queue.push(queue);
    return queue;
  }

  async publishInExchange(queue: any): Promise<Queue> {
    this.queue.push(queue);
    return queue
  }
}
