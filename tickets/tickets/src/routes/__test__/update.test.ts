import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if provided id does not exists', async() => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 20
    })
    .expect(404);
});

it('returns 401 if user is not autheticated', async() => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'test',
      price: 20
    })
    .expect(401);
});

it('returns 401 if the user does not own the ticket', async() => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'test',
        price: 10,
      });
    
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', global.signin())
      .send({
        title: 'test2',
        price: 3
      })
      .expect(401);
});

it('returns 400 if the user provides not valid title or price', async() => {
  const cookie = global.signin();

  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: 'test',
    price: 10,
  });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 3
    })
    .expect(400);
    
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: -10
    })
    .expect(400);
});

it('returns 200 if the user provides valid data', async() => {
  const cookie = global.signin();

  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: 'test',
    price: 10,
  });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 100
    })
    .expect(200);
  
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send();
  
  expect(ticketResponse.body.title).toEqual('test');
  expect(ticketResponse.body.price).toEqual(100);
});

it('publishes an event', async() => {
  const cookie = global.signin();

  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: 'test',
    price: 10,
  });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 100
    })
    .expect(200);
  
  await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects the changes if a ticket is reserved', async() => {
  const cookie = global.signin();

  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: 'test',
    price: 10,
  });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 100
    })
    .expect(400);
  
});