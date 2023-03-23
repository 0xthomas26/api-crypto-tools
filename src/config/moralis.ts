import Moralis from 'moralis';

export default async (): Promise<void> => {
    await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
    });
    console.log('Moralis setup done');
};
