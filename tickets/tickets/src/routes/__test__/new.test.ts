import request from 'supertest';
import { app } from '../../app';

it('has a route handler listening to /api/tickets for post request', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is sign in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if user is sign in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('return an error if invalid title was provided', async () => {

});

it('return an error if invalid price was provided', async () => {

});

it('creates a tickets with valid inputs', async () => {

});