import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response: NextApiResponse) => {
    const users = [
        { id: 1, name: 'Victor' },
        { id: 2, name: 'Miryam' },
        { id: 3, name: 'Lívia' }
    ];

    return response.json(users);
}