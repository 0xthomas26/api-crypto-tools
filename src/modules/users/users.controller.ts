import { Response } from 'express';

import { CustomError } from '../../utils/customError';
import Moralis from 'moralis';
import jwt from 'jsonwebtoken';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import Web3 from 'web3';
import { zerionFetcher } from '../../utils/zerionFetcher';

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

export const getUserPortfolio = async (req: any, res: Response) => {
    try {
        const { walletAddress } = req.query;

        const data = await zerionFetcher(
            `${process.env.ZERION_API_URL}/wallets/${walletAddress}/portfolio?currency=usd`
        );

        return res.status(200).json(data);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const getUserPositions = async (req: any, res: Response) => {
    try {
        const { walletAddress, type } = req.query;

        const data = await zerionFetcher(
            `${process.env.ZERION_API_URL}/wallets/${walletAddress}/positions/?currency=usd&filter[position_types]=${type}&sort=value`
        );

        return res.status(200).json(data);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const getUserChains = async (req: any, res: Response) => {
    try {
        const { chainId } = req.query;

        const data = await zerionFetcher(`${process.env.ZERION_API_URL}/chains/${chainId}`);

        return res.status(200).json(data);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const getUserTransactions = async (req: any, res: Response) => {
    try {
        const data = await zerionFetcher(
            `${process.env.ZERION_API_URL}/wallets/${req.account}/transactions?currency=usd&page[size]=100`
        );

        return res.status(200).json(data);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const getUserFungibles = async (req: any, res: Response) => {
    try {
        const { chainId, query } = req.query;

        const data = await zerionFetcher(
            `${process.env.ZERION_API_URL}/fungibles/?currency=usd&page[size]=100&filter[implementation_chain_id]=${chainId}&filter[search_query]=${query}&sort=-market_data.market_cap`
        );

        return res.status(200).json(data);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
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

export const getUserTokensPrice = async (req: any, res: Response) => {
    try {
        const { addressOne, addressTwo, chain } = req.query;

        const responseOne = await Moralis.EvmApi.token.getTokenPrice({
            chain: chain,
            address: addressOne,
        });

        const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
            chain: chain,
            address: addressTwo,
        });

        const usdPrices = {
            tokenOne: responseOne.raw.usdPrice,
            tokenTwo: responseTwo.raw.usdPrice,
            ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice,
        };

        return res.status(200).json(usdPrices);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const getUserTokensBalance = async (req: any, res: Response) => {
    try {
        const address = req.account;
        const { addressOne, addressTwo, fromDecimals, toDecimals, chain } = req.query;

        let responseOne;
        let responseTwo;
        let balances = {
            tokenOne: '0',
            tokenTwo: '0',
        };
        if (addressOne === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
            responseOne = await Moralis.EvmApi.balance.getNativeBalance({
                address,
                chain,
            });
            balances.tokenOne = (parseFloat(responseOne.raw?.balance) / 10 ** fromDecimals).toFixed(
                6
            );
        } else {
            responseOne = await Moralis.EvmApi.token.getWalletTokenBalances({
                chain: chain,
                tokenAddresses: [addressOne],
                address,
            });
            balances.tokenOne = (
                responseOne.raw.length === 0
                    ? 0
                    : parseFloat(responseOne.raw[0]?.balance) / 10 ** responseOne.raw[0]?.decimals
            ).toFixed(6);
        }

        if (addressTwo === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
            responseTwo = await Moralis.EvmApi.balance.getNativeBalance({
                address,
                chain,
            });
            balances.tokenTwo = (parseFloat(responseTwo.raw?.balance) / 10 ** toDecimals).toFixed(
                6
            );
        } else {
            responseTwo = responseTwo = await Moralis.EvmApi.token.getWalletTokenBalances({
                chain: chain,
                tokenAddresses: [addressTwo],
                address,
            });
            balances.tokenTwo = (
                responseTwo.raw.length === 0
                    ? 0
                    : parseFloat(responseTwo.raw[0]?.balance) / 10 ** responseTwo.raw[0]?.decimals
            ).toFixed(6);
        }

        return res.status(200).json(balances);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
