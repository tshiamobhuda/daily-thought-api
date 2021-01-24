/**
 * Copyright (c) 2021 Tshiamo Bhuda
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

require('dotenv').config();

const { getClient } = require('../helpers/dbHelper');
const axios = require('axios');
const cheerio = require('cheerio');
const process = require('process');

const link = process.env.SITE_URL;

exports.handler = async function () {
    try {
        const { data } = await axios.get(link);

        const $ = cheerio.load(data);
        const $content = $('.daily-thought').find('.more-text').first();

        const date = $('.daily-thought').find('.div-date').first().text().trim();
        const verse = $content.find('strong').first().text().match(/(?!.*verse|:)\b((?!‘|\.).)+/gi);
        const notes = $content.text().trim().match(/-\s\b((?!\.|(prayer)).)+/gi);
        const prayer = $content.text().trim().match(/(?!.*prayer|:)\b(.)+/gi);

        const record = {
            date: date,
            chapter: verse[0],
            verse: verse[1],
            notes: notes,
            prayer: prayer.join()
        };

        const client = await getClient();
        const db = client.db();

        const result = await db.collection('thoughts').insertOne(record);
        console.log(`${result.insertedCount} record inserted at id => ${result.insertedId}`);

        client.close();

        return {
            statusCode: 200,
            body: JSON.stringify(result.insertedId)
        };
    } catch (error) {
        console.log(error);

        return {
            statusCode: 404,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify('An Error occurred'),
        };
    }
};
