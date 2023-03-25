import * as controller from './users.controller';
import * as validate from './users.validation';
import * as express from 'express';
import { verifyToken } from '../../utils/verifyToken';

const router = express.Router();

router.get('/user/me', verifyToken, controller.getSignedInUser);

router.get('/user/nfts', verifyToken, controller.getUserNFTs);

router.post('/user/login/walletAddress', validate.signInUserAddress, controller.signInUserAddress);

router.post('/user/login/wallet', validate.signInUserWallet, controller.signInUserWallet);

router.post('/user/login/challenge', validate.signInUserChallenge, controller.signInUserChallenge);

export const userRouter = router;
