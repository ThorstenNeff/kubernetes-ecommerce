import { Message } from 'node-nats-streaming';
import { OrderStatus, Subjects, Listener, TicketUpdatedEvent, ExpirationCompleteEvent } from '@neffuke/common';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-goup-name';
import { OrderCancelledPublisher } from '../publisher/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGoupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');
        
        if (!order) {
            throw new Error("Order not found");
        } 
        
        order.set({
            status: OrderStatus.Cancelled
        });

        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });
        
        msg.ack();
    }
}