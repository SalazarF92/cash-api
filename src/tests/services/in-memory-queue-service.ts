import { Queue } from "@/application/entities/queue";
import { QueueService } from "@/application/service-repositories/queue-repository";
import { Replace } from "@/common/helpers/Replace";

export class InMemoryQueueService implements QueueService {
  private queue: Partial<Queue>[] = [];

  async consume(queue: string, callback: (msg: any) => any): Promise<any> {
    this.queue.shift();
    return callback(queue);
  }

  async publishInQueue(
    queue: Replace<Queue, { exchange?: string }>
  ): Promise<Replace<Queue, { exchange?: string }>> {
    this.queue.push(queue);
    return queue;
  }

  async publishInExchange(queue: any): Promise<Queue> {
    this.queue.push(queue);
    return queue;
  }
}
