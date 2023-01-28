import { InMemoryQueueService } from "./services/in-memory-queue-service";

const props = {
  id: "id",
  queue: "queue",
  topic: "topic",
  exchange: "exchange",
  payload: {
    id: "id",
    body: "message",
  },
};
const queueService = new InMemoryQueueService();

describe("QueueService", () => {
  it("should publish to queue", async () => {
    const queue = await queueService.publishInQueue(props);
    expect(queue).toBeTruthy();
    expect(queue.payload.body).toContain("message");
    expect(queue.queue).toContain("queue");
    expect(typeof queue.queue).toBe(typeof "string");
    expect(queue.topic).toContain("topic");
    expect(typeof queue.topic).toBe(typeof "string");
  });

  it("should publish to exchange", async () => {
    const queue = await queueService.publishInExchange(props);
    expect(queue).toBeTruthy();
    expect(queue.exchange).toBe("exchange");
    expect(typeof queue.exchange).toBe(typeof "string");
    expect(queue.payload.body).toContain("message");
    expect(queue.queue).toContain("queue");
    expect(typeof queue.queue).toBe(typeof "string");
    expect(queue.topic).toContain("topic");
    expect(typeof queue.topic).toBe(typeof "string");
  });
});
