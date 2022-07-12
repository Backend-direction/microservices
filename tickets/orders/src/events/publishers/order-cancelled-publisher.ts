import { OrderCancelledEvent, Publisher, Subjects } from "@vpankitickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}