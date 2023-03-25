import * as controller from './users.controller';
import * as validate from './users.validation';
import * as express from 'express';
import { verifyToken } from '../../utils/verifyToken';

const router = express.Router();

// USER DATA
router.get('/user/me', verifyToken, controller.getSignedInUser);

// MORALIS
router.get('/user/nfts', verifyToken, controller.getUserNFTs);

// ZERION
router.get('/user/portfolio', verifyToken, validate.getUserPortfolio, controller.getUserPortfolio);
router.get('/user/positions', verifyToken, validate.getUserPositions, controller.getUserPositions);
router.get('/user/chains', verifyToken, validate.getUserChains, controller.getUserChains);

// AUTH WALLETS
router.post('/user/login/walletAddress', validate.signInUserAddress, controller.signInUserAddress);
router.post('/user/login/wallet', validate.signInUserWallet, controller.signInUserWallet);
router.post('/user/login/challenge', validate.signInUserChallenge, controller.signInUserChallenge);

export const userRouter = router;
