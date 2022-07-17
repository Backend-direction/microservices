import { PaymentCreatedEvent, Publisher, Subjects } from "@vpankitickets/common";



export class PaymentCretaedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}