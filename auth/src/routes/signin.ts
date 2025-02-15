import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from "../models/User"
import { validateRequest } from '@neffuke/common';
import { BadRequestError } from '@neffuke/common';
import { Password } from '../services/password';

const router = express.Router();

router.post("/api/users/signin", [
    body('email').isEmail().withMessage("Email must be valid"),
    body('password').trim().isLength({min:4,max:20}).withMessage("Password is mandatory")
], validateRequest, async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError("Invalid credentials in use");
    } else {
        const passwordsMatch = await Password.compare(existingUser.password.toString(), password);
        if (!passwordsMatch) {
            throw new BadRequestError("Invalid credentials");
        }
        
        // Generate JWT 
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!); 

        // Store it on a session object
        req.session = {
            jwt: userJwt
        };

        res.status(200).send(existingUser);
    }
});

export { router as signinRouter }