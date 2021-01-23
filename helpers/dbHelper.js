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

exports.getClient = async function () {
    return await MongoClient.connect(
        `mongodb+srv://${user}:${pass}@${cluster}/${database}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );
};
