import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, BadRequestError, NotAuthorizedError, OrderStatus } from '@neffuke/common';
import { body } from 'express-validator';
import { Order } from '../models/orders';

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
    
    res.send({success: true});
});

export { router as createChargeRouter }