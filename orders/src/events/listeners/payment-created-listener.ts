import { Subjects, Listener, PaymentCreatedEvent } from '@neffuke/common'
import { queueGroupName } from '../../../../payments/src/events/listeners/queue-goup-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderStatus } from '@neffuke/common';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    queueGoupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        
        if (!order) {
            throw new Error("Order not found");
        }

        order.set({
            status: OrderStatus.Complete
        });
        await order.save();

        msg.ack();
    };
}