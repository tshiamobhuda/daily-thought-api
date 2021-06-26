/**
 * Copyright (c) 2021 Tshiamo Bhuda
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { getClient } = require('../helpers/dbHelper');

const requestHeaders = {
    headers: {
        'Access-Control-Allow-Headers':
            'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'OPTIONS',
        'Access-Control-Max-Age': '-1',
        'Access-Control-Allow-Origin': '*',
        Vary: 'Origin',
    },
};

exports.handler = async function () {
    try {
        const client = await getClient();

        const db = client.db();
        const cursor = db
            .collection('thoughts')
            .find()
            .sort({ _id: -1 })
            .limit(1);

        const doc = await cursor.next();

        await client.close();

        if (!doc) {
            throw new Error('MongoDB | Cursor returned without any results');
        }

        return {
            statusCode: 200,
            ...requestHeaders,
            body: JSON.stringify(doc),
        };
    } catch (error) {
        console.log(error);

        return {
            statusCode: 404,
            ...requestHeaders,
            body: JSON.stringify('An Error occurred'),
        };
    }
};
