import mongoose from "mongoose";
import { Order, OrderStatus } from "./orders";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ticketAttrs {
  title: string;
  price: number;
  id: string;
}


export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TickModel extends mongoose.Model<TicketDoc> {
  build(attrs: ticketAttrs): TicketDoc;
  findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
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
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findByEvent = (event: { id: string, version: number} ) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

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