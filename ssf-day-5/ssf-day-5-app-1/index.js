// Step 1: Load required libraries. Eg. Load path and express.
const path = require('path');
const express = require('express');
const request = require('request');

// Step 2: Create an instance of the application.
const app = express();

// Step 2.1: Setup the local data store.
const cachedb = {};
cachedb['cat'] = { term: 'cat', limit: 3, cached_time: 1537505881, urls: ['https://cat1.gif', 'https://cat2.gif', 'https://cat3.gif'] };

// Step 3: Define routes
// GET /v1/gifs/search?term=cat
app.get('/v1/gifs/search', (req, resp) => {
    const term = req.query.term.toLowerCase();
    const limit = req.query.limit;
    const current_time = Math.round(new Date().getTime() / 1000.0);
    resp.format({
        'application/json': () => {
            if (term in cachedb) {
                console.log('Search term is in cachedb');
                timeElapsed = current_time - cachedb[term].cached_time;
                if (timeElapsed < 60) {
                    console.log('Time elapsed between search is less than 60 seconds in cachedb');
                    diffLimit = limit - cachedb[term].limit;
                    if (diffLimit <= 0) {
                        console.log('New limit is less than or equals to current limit in cachedb');
                        if (diffLimit < 0) {
                            console.log('New limit is less than current limit in cachedb');
                            cachedb[term].urls.splice(diffLimit);
                        }
                        resp.json({
                            term: cachedb[term].term,
                            limit: cachedb[term].limit,
                            cached_time: cachedb[term].cached_time,
                            urls: cachedb[term].urls
                        });
                        return;
                    }
                }
            }

            console.log('Perform API call to Giphy at: ', new Date(current_time * 1000).toLocaleString());
            const API_KEY = 'ahO155GUo8p9sjl8STz48uZrtOo5M33V';
            // https://api.giphy.com/v1/gifs/search?api_key=ahO155GUo8p9sjl8STz48uZrtOo5M33V&q=cat&limit=1&offset=0&rating=G&lang=en
            request.get('https://api.giphy.com/v1/gifs/search',
                { qs: { api_key: API_KEY, q: term, limit: limit, offset: 0, rating: 'G', lang: 'en' } },
                (err, response, body) => {
                    if (err) {
                        resp.status(400);
                        resp.type('text/plain');
                        resp.send(err);
                        return;
                    }

                    var urlArray = [];
                    //Parse the JSON string to JSON
                    const result = JSON.parse(body);
                    // console.log("result.data:", result.data);
                    const dataArray = result.data;
                    for (imageIndex in dataArray) {
                        console.log("imageIndex:", imageIndex);
                        console.log("dataArray[imageIndex].images.fixed_width.url:", dataArray[imageIndex].images.fixed_width.url);
                        urlArray.push(dataArray[imageIndex].images.fixed_width.url);
                    }

                    if (dataArray.length > 0) {
                        cachedb[term] = { term: term, limit: limit, cached_time: current_time, urls: urlArray };
                        resp.json({
                            term: term,
                            limit: limit,
                            cached_time: current_time,
                            urls: urlArray
                        });
                        return;
                    }
                }
            );
        },
        'default': () => {
            resp.status(406).end();
        }
    });
});

// Step 3.1: Serve static resources
app.use(express.static(path.join(__dirname, 'public')));

// Step 3.2: Redirect to default page if no match.
app.use((req, resp) => {
    resp.redirect('/');
});

// Step 4: Start the server
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;

app.listen(PORT, () => {
    console.info(`Application started on port ${PORT}`);
});