import * as controller from './users.controller';
import * as validate from './users.validation';
import * as express from 'express';

const router = express.Router();

router.post('/user/login/wallet', validate.signInUserWallet, controller.signInUserWallet);

router.post('/user/login/challenge', validate.signInUserChallenge, controller.signInUserChallenge);

export const userRouter = router;
