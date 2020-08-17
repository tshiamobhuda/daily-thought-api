const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = function (event, context, callback) {
    axios.get('https://alivetogod.com/daily-thoughts')
    .then(function (response) {
        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const $content = $('.daily-thought').find('.more-text').first();

            const verse = $content.find('strong').first().text().match(/(?!.*verse|:)\b((?!‘|\.).)+/gi);
            const notes = $content.text().trim().match(/-\s\b((?!\.|(prayer)).)+/gi);
            const prayer = $content.text().trim().match(/(?!.*prayer|:)\b(.)+/gi)

            callback(null, {
                statusCode: 200,
                body: 'Ok'
            })
        }
    }).catch(function (err) {
        console.log('Axios | Error occurred', err)
        
        callback(err);
    });
}