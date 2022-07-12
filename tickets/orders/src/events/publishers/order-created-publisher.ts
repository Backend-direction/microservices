import { OrderCreatedEvent, Publisher, Subjects } from "@vpankitickets/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}