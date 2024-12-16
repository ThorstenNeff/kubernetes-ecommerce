import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@neffuke/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt:0 }).withMessage('Price must be greater than zero')
], validateRequest, (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
        title, 
        price,
        id: req.currentUser?.id
    })
    res.sendStatus(200);
});

export { router as createTicketRouter }