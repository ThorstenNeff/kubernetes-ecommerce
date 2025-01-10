import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, BadRequestError, NotAuthorizedError, OrderStatus } from '@neffuke/common';
import { body } from 'express-validator';
import { Order } from '../models/orders';
import { stripe } from '../stripe';
import { Payment } from '../models/payments';
import { natsWrapper } from '../nats-wrapper';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';

const router = express.Router(); 

router.post('api/payments', requireAuth, [
    body('token').not().isEmpty().withMessage("api/payments token must not be empty"),
    body('orderId').not().isEmpty().withMessage("api/payments token must not be empty"),
], validateRequest, async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("Order already cancelled");
    }

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    });
    
    const payment = Payment.build({
        orderId,
        stripeId: charge.id
    });
    await payment.save();
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
    });
    
    res.status(201).send({id: payment.id });
});

export { router as createChargeRouter }