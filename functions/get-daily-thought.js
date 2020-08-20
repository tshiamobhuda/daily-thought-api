/**
 * Copyright (c) 2020 Tshiamo Bhuda
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

exports.handler = function (event, context, callback) {
    MongoClient.connect(uri, options).then((client) => {
        const db = client.db();
        const cursor = db.collection('thoughts').find().sort({_id: -1}).limit(1);
        
        cursor.next().then((doc) => {
            console.log(client.isConnected(),doc);

            callback(null, {
                statusCode: 200,
                body: JSON.stringify(doc)
            });
        }).catch((error) => {
            console.error('MongoDB | Error occurred during: forEach', error);

            callback(error);
        }).finally(() => {
            client.close();
        });
    }).catch((error) => {
        console.log('MongoDB | Error occurred during: connect', error);

        callback(error);
    });
};
