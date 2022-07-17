import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@vpankitickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { PaymentCretaedPublisher } from '../events/publishers/payment-created-publisher';
import { Order } from '../models/order';
import { Payment } from '../models/payments';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe';


const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty(),
    body('orderId')
      .not()
      .isEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    console.log(order);
    
    if(!order) throw new NotFoundError();
    if(order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if(order.status  === OrderStatus.Cancelled) {
      throw new BadRequestError('Order was cancelled');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id
    });
    await payment.save();

    await new PaymentCretaedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    });

    res.status(201).send({ id: payment.id });
});

export { router as cretaeChatrgeRouter };