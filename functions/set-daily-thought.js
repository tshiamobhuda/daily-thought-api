const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');

const user = process.env.MDB_USER;
const pass = process.env.MDB_PASS;
const database = process.env.MDB_DB;
const link = process.env.SITE_URL;

const uri = `mongodb+srv://${user}:${pass}@cluster0.a3rzr.mongodb.net/${database}?retryWrites=true&w=majority`;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

exports.handler = function (event, context, callback) {
    axios.get(link).then(function (response) {
        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const $content = $('.daily-thought').find('.more-text').first();

            const date = $('.daily-thought').find('.div-date').first().text().trim();
            const verse = $content.find('strong').first().text().match(/(?!.*verse|:)\b((?!‘|\.).)+/gi);
            const notes = $content.text().trim().match(/-\s\b((?!\.|(prayer)).)+/gi);
            const prayer = $content.text().trim().match(/(?!.*prayer|:)\b(.)+/gi);

            const data = {
                date: date,
                chapter: verse[0],
                verse: verse[1],
                notes: notes,
                prayer: prayer.join()
            };

            MongoClient.connect(uri, options).then((client) => {
                const db = client.db();

                db.collection('thoughts').insertOne(data).then((result) => {
                    console.log(`${result.insertedCount} record inserted at id => ${result.insertedId}`);

                    callback(null, {
                        statusCode: 200,
                        body: JSON.stringify(result.insertedId)
                    });
                }).catch((error) => {
                    console.log('MongoDB | Error occurred during: insertOne', error);

                    callback(error);
                });

                client.close();
            }).catch((error) => {
                console.log('MongoDB | Error occurred during: connect', error);

                callback(error);
            });

        }
    }).catch(function (err) {
        console.log('Axios | Error occurred during: get', err);

        callback(err);
    });
};
