import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('docker-desktop', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log("Listener connected to NATS");

    const subscription = stan.subscribe('ticket:created');
    subscription.on('message', (msg: Message) => {
        const data = msg.getData();
        if (typeof data === 'string') {
            console.log(`Message #${msg.getSequence()} received `, data);
        }
    });
});