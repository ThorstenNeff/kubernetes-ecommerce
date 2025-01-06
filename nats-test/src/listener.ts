import nats, { Message, SubscriptionOptions, Stan } from 'node-nats-streaming'
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('docker-desktop', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log("Listener connected to NATS");

    stan.on('close', () => {
        console.log("NATS connection closed");
        process.exit();
    });
    new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

abstract class Listener {
    abstract subject: string;
    abstract queueGoupName: string;
    abstract onMessage(data: any, msg: Message): void;
    private client: Stan;
    protected ackWait = 5 * 1000; 

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
        .subscriptionOptions()
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGoupName);
    }

    listen() {
        console.log("Listen");
        const subscription = stan.subscribe(
            this.subject,
            this.queueGoupName, 
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(
                `Message received: ${this.subject} ${this.queueGoupName}`
            )
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg)
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'));
    }
}

class TicketCreatedListener extends Listener {
    subject = 'ticket:created';
    queueGoupName = 'payments-service';

    onMessage(data: any, msg: Message) {
        console.log('Event data', data);

        msg.ack();
    }
}