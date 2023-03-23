import { Express, Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/customError';
import { userRouter } from '../modules/users/users.routes';

export default (app: Express) => {
    app.use('/api/v1', userRouter);

    //Not Found
    app.use((req: Request, res: Response, next: NextFunction) => {
        const error = new CustomError('not-found', 404);
        next(error);
    });

    //Errors Management
    app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        console.log('err management=', err.message);
        // render the error page
        res.status(err.status || 500);
        res.json({ error: { message: err.message } });
    });

    console.log('routes setup done');
};
