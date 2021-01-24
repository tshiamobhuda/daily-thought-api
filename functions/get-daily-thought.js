/**
 * Copyright (c) 2021 Tshiamo Bhuda
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { getClient } = require('../helpers/dbHelper');

const requestHeaders = {
    headers: {
        'Content-Type': 'application/json'
    }
};

exports.handler = async function () {
    try {
        const client = await getClient();

        const db = client.db();
        const cursor = db.collection('thoughts').find().sort({_id: -1}).limit(1);

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
            body: JSON.stringify('An Error occurred')
        };
    }
};
