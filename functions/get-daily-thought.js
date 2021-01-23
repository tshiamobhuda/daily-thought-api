/**
 * Copyright (c) Tshiamo Bhuda
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

require('dotenv').config();

const { MongoClient } = require('mongodb');
const process = require('process');

const user = process.env.MDB_USER;
const pass = process.env.MDB_PASS;
const database = process.env.MDB_DB;
const cluster = process.env.MDB_CLUSTER;

const uri = `mongodb+srv://${user}:${pass}@${cluster}/${database}?retryWrites=true&w=majority`;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const requestHeaders = {
    headers: {
        'Content-Type': 'application/json'
    }
};

exports.handler = async function () {
    try {
        const client = await MongoClient.connect(uri, options);
        
        const db = client.db();
        const cursor = db.collection('thoughts').find().sort({_id: -1}).limit(1);

        const doc = await cursor.next();

        if (!doc) {
            throw new Error('MongoDB | Cursor returned without any results');
        }

        await client.close();

        return {
            statusCode: 200,
            ...requestHeaders,
            body: JSON.stringify(doc),
        };
    } catch (error) {
        if (8000 === error.code) {
            console.log(`MongoDB | Error occurred during: MongoClient.connect | ${error}`);
        } else {
            console.log(error);
        }

        return {
            statusCode: 404,
            ...requestHeaders,
            body: JSON.stringify('An Error occurred')
        };
    }
};
