import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@neffuke/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-goup-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGoupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.id);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();
        
        msg.ack();
    }
}