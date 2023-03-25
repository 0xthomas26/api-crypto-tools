import dotenv from 'dotenv';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: string;
            PORT: string;
            MORALIS_API_KEY: string;
            SECRET: string;
        }

        interface Global {
            getAsync: any;
            setAsync: any;
        }
    }
}

export default (): void => {
    //  Set environment variables
    dotenv.config();
    console.log('environment setup done');
};
