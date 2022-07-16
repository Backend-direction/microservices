import { ExpirationComplete, Publisher, Subjects } from "@vpankitickets/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationComplete> {
  readonly subject =  Subjects.ExpirationComplete;
}