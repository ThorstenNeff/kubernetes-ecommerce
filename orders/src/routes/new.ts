import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth, validateRequest, OrderStatus, BadRequestError } from '@neffuke/common';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';

const router = express.Router(); 

router.post('api/orders', requireAuth, [
    body('ticketId')
    .not()
    .isEmpty()
    .withMessage("TicketId must be provided")
], validateRequest, async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    // Run query to look at all orders. Find an order where the ticket
    // is the ticket we just found *and* the order status is *not* cancelled
    // If we find an order from that means
    const existingOrder = await Order.findOne({
        ticket: ticket, 
        status: {
            $in: [
                OrderStatus.Created, 
                OrderStatus.Complete, 
                OrderStatus.AwaitingPayment
            ]
        }
    });
    if (existingOrder) {
        throw new BadRequestError("Ticket is already reserved");
    }

    // Calculate an expiration date
    
    res.send({});
});

export { router as newOrderRouter }