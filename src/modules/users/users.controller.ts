import { Request, Response } from 'express';

import { CustomError } from '../../utils/customError';
import Moralis from 'moralis';

export const signInUserWallet = async (req: any, res: Response) => {
    try {
        const { message, signature } = req.body;

        const { address, profileId } = (
            await Moralis.Auth.verify({ message, signature, network: 'evm' })
        ).raw;

        if (!address || !profileId) throw new CustomError('signature-verification-failed', 401);

        return res.status(200).json({ address });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const signInUserChallenge = async (req: any, res: Response) => {
    try {
        const config = {
            domain: process.env.NODE_ENV === 'production' ? 'example.com' : 'localhost',
            statement:
                'Welcome to Crypto Tools. Please sign this message to confirm your identity.',
            uri: 'http://localhost:3000',
            timeout: 120,
        };
        const { publicAddress, chain } = req.body;

        const message = await Moralis.Auth.requestMessage({
            address: publicAddress,
            chain: chain,
            network: 'evm',
            ...config,
        });

        return res.status(200).json(message);
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};
