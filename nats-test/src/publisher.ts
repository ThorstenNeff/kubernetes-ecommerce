import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
import { TicketCreatedEvent } from './events/ticket-created-event';
import { Subjects } from './events/subjects';

console.clear();

const stan = nats.connect('docker-desktop', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log("Publisher connected to NATS");
    const publisher = new TicketCreatedPublisher(stan);

    publisher.publish({
        id: '123',
        title: 'concert',
        price: 20
    });
});
