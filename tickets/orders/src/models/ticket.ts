import mongoose from "mongoose";
import { Order, OrderStatus } from "./orders";

interface ticketAttrs {
  title: string;
  price: number;
}


export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TickModel extends mongoose.Model<TicketDoc> {
  build(attrs: ticketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret._id = ret._id;
      delete ret._id;
    }
  }
});

ticketSchema.statics.build = (attrs: ticketAttrs) => {
  return new Ticket(attrs);
}

ticketSchema.methods.isReserved = async function() {
  const exsistingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.AwaitingPayment,
        OrderStatus.Created,
        OrderStatus.Complete
      ]
    }
  });

  return !!exsistingOrder;
}

const Ticket = mongoose.model<TicketDoc, TickModel>('Ticket', ticketSchema);

export { Ticket };