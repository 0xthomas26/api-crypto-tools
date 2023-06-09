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

export const getUserPortfolio = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        walletAddress: Joi.string().required(),
    });
    const { error } = schema.validate(req.query);
    if (error && error.details) {
        console.log(error.details);
        return res.status(400).json(`${error.details[0].message}`);
    }
    next();
};

export const getUserPositions = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        walletAddress: Joi.string().required(),
        type: Joi.string().required(),
    });
    const { error } = schema.validate(req.query);
    if (error && error.details) {
        return res.status(400).json(`${error.details[0].message}`);
    }
    next();
};

export const getUserChains = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        chainId: Joi.string().required(),
    });
    const { error } = schema.validate(req.query);
    if (error && error.details) {
        return res.status(400).json(`${error.details[0].message}`);
    }
    next();
};

export const getUserFungibles = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        chainId: Joi.string().required(),
        query: Joi.string().allow(''),
    });
    const { error } = schema.validate(req.query);
    if (error && error.details) {
        return res.status(400).json(`${error.details[0].message}`);
    }
    next();
};

export const getUserTokensPrice = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        addressOne: Joi.string().required(),
        addressTwo: Joi.string().required(),
        chain: Joi.string().required(),
    });
    const { error } = schema.validate(req.query);
    if (error && error.details) {
        console.log(error.details);
        return res.status(400).json(`${error.details[0].message}`);
    }
    next();
};

export const getUserTokensBalance = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        addressOne: Joi.string().required(),
        addressTwo: Joi.string().required(),
        fromDecimals: Joi.string().required(),
        toDecimals: Joi.string().required(),
        chain: Joi.string().required(),
    });
    const { error } = schema.validate(req.query);
    if (error && error.details) {
        console.log(error.details);
        return res.status(400).json(`${error.details[0].message}`);
    }
    next();
};
