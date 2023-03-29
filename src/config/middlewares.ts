import cors from 'cors';
import logger from 'morgan';
import express from 'express';
import compression from 'compression';

export default (app: any) => {
    app.use(compression());

    // Load App Middlewares
    app.use(logger('dev'));

    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: true,
        })
    );

    //Setup Cors
    const whitelist = [
        'http://localhost:3000',
        'https://crypto-tools-hjg5fqr92-0xthomas26.vercel.app',
        'https://crypto-tools-sigma.vercel.app',
    ];

    const corsOptions = {
        origin: function (origin: any, callback: any) {
            if (!origin) return callback(null, true);

            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
    };

    app.options('*', cors(corsOptions));
    app.use(cors(corsOptions));

    console.log('middlewares setup done');
};
