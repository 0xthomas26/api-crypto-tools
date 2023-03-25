import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

export const signInUserChallenge = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        publicAddress: Joi.string().required(),
        chain: Joi.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error && error.details) {
        console.log(error, req.body);
        return res.status(400).json(`${error.details[0].message}`);
    }
    next();
};

export const signInUserWallet = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        message: Joi.string().required(),
        signature: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error && error.details) {
        return res.status(400).json(`${error.details[0].message}`);
    }
    next();
};

export const signInUserAddress = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        walletAddress: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error && error.details) {
        return res.status(400).json(`${error.details[0].message}`);
    }
    next();
};
