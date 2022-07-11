import { Publisher, Subjects, TicketCreatedEvent } from "@vpankitickets/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated; 
}