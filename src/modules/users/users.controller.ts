import { Response } from 'express';

import { CustomError } from '../../utils/customError';
import Moralis from 'moralis';
import jwt from 'jsonwebtoken';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { ethers } from 'ethers';
import Web3 from 'web3';

export const getSignedInUser = async (req: any, res: Response) => {
    try {
        return res.status(200).json({ account: req.account });
    } catch (err: any) {
        console.log(err);
        if (err.status && err.message) {
            console.log(err.message);
            return res.status(err.status).json(err.message);
        }
        return res.status(500).json(err);
    }
};

export const getUserNFTs = async (req: any, res: Response) => {
    try {
        const allNFTs = [];
        const chains = [
            EvmChain.ETHEREUM,
            EvmChain.BSC,
            EvmChain.POLYGON,
            EvmChain.ARBITRUM,
            EvmChain.AVALANCHE,
        ];

        for (const chain of chains) {
            const response = await Moralis.EvmApi.nft.getWalletNFTs({
                address: req.account,
                chain,
            });

            allNFTs.push({ nfts: response?.result, chain });
        }

        return res.status(200).json({ nfts: allNFTs });
    } catch (err: any) {
        console.log(err);
        if (err.status && err.message) {
            console.log(err.message);
            return res.status(err.status).json(err.message);
        }
        return res.status(500).json(err);
    }
};

export const signInUserAddress = async (req: any, res: Response) => {
    try {
        const { walletAddress } = req.body;

        if (!Web3.utils.isAddress(walletAddress))
            throw new CustomError('wallet-verification-failed', 403);

        const token = jwt.sign({ id: walletAddress }, process.env.SECRET, {
            expiresIn: '7d',
        });

        return res.status(200).json({ address: walletAddress, token });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const signInUserWallet = async (req: any, res: Response) => {
    try {
        const { message, signature } = req.body;

        const { address, profileId } = (
            await Moralis.Auth.verify({ message, signature, network: 'evm' })
        ).raw;

        if (!address || !profileId) throw new CustomError('signature-verification-failed', 401);

        const token = jwt.sign({ id: address }, process.env.SECRET, {
            expiresIn: '7d',
        });

        return res.status(200).json({ address, token });
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
