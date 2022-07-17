import { ExpirationComplete, Listener, OrderStatus, Subjects, TicketCreatedEvent } from "@vpankitickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";


export class ExpirationCompleteListener extends Listener<ExpirationComplete> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationComplete['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if(!order) {
      throw new Error('Order not found');
    }

    if(order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled
    });

    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      }
    });

    msg.ack();
  }
}