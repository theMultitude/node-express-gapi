const express    = require('express');
const bodyParser = require('body-parser');
const fetch      = require('node-fetch');

const app = express();
const config = require('./config');

const PORT = config.port;
const KEY = config.gmap.apiKey;
let QUERY = 'tacos+near+me'
const URL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${QUERY}&key=${KEY}`

app.use(bodyParser.json());

fetch(URL).then(res => res.json()).then(json => console.log(json));

app.get('/places', (req, res) => {
    QUERY = req.params.query;
})

app.listen(PORT, err => {
    if (err) {
        console.log(`Error starting server at port: ${PORT}`);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
})