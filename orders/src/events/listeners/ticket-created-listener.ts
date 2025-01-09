import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@neffuke/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-goup-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
    queueGoupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        const { id, title, price } = data;
        const ticket = Ticket.build({
            id, title, price
        });
        await ticket.save();

        msg.ack();
    }
}