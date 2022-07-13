import { Ticket } from '../ticket';


it('implements optimistic concurrency control', async () => {
    const ticket  = Ticket.build({
      title: 'concert',
      price: 5,
      userId: '123'
    });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    await firstInstance!.save();
    // save the second fetched ticket and expect an error
    try {
      await secondInstance!.save();
    } catch (err) {
      return;
    }

    throw new Error('Should not reach taht point');
});

it('increments the version  number on multiple saves', async () => {
  const ticket  = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });

  ticket.save();
  expect(ticket.version).toEqual(0);

  ticket.save();
  expect(ticket.version).toEqual(1);
});