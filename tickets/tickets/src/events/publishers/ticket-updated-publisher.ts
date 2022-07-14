import { Publisher, Subjects, TicketUpdatedEvent } from "@vpankitickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated; 
}