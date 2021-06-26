# Daily Thought API

Little API built for pulling the latest Daily-Thought (Verse of the day) from [Alive To God](https://alivetogod.com/daily-thoughts)

[![Netlify Status](https://api.netlify.com/api/v1/badges/b11ce837-6973-4e34-aa58-7b5a4d50ba2b/deploy-status)](https://app.netlify.com/sites/daily-thought-app/deploys)

### To run this API locally follow these steps:

1. install all dependencies
```shell
npm install
```
2. run the api locally
```shell
npm run serve
```
3. get the latest daily thought content
```shell
http://localhost:3005/.netlify/functions/get-daily-thought
```


## This API uses the following dependencies:

- [netlify-lambda](https://www.npmjs.com/package/netlify-lambda)
- [axios](https://www.npmjs.com/package/axios)
- [cheerio](https://www.npmjs.com/package/cheerio)
- [mongodb](https://www.npmjs.com/package/mongodb)
- [dotenv](https://www.npmjs.com/package/dotenv)
