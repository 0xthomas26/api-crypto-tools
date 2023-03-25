import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface userRequest extends Request {
    account?: string;
}

export const verifyToken = async (req: userRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'] as string;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || token === undefined) {
        return res.status(401).json('credentials-required');
    }

    jwt.verify(token, `${process.env.SECRET}`, async (err: any, decoded: any) => {
        if (err) {
            console.log(err);
            return res.status(401).send('invalid-token');
        }
        req.account = decoded?.id;
        next();
    });
};
