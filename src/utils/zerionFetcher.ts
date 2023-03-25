import axios from 'axios';

export const zerionApiConfig = () => {
    // Headers
    const config = {
        headers: {
            accept: 'application/json',
            authorization: `Basic ${process.env.ZERION_API_KEY}`,
        },
    };

    return config;
};

export const zerionFetcher = async (url: string) => {
    try {
        const header = zerionApiConfig();
        const res = await axios.get(url, header);
        return res.data;
    } catch (error) {
        console.log(error);
        return { error };
    }
};
