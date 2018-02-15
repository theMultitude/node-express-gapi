const express    = require('express');
const bodyParser = require('body-parser');
const fetch      = require('node-fetch');

const app    = express();
const config = require('./config');

const PORT = config.port;
const KEY  = config.gmap.apiKey;
let QUERY  = 'Restaurants+in+Austin+Tacos'
const SEARCH_URL  = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${QUERY}&key=${KEY}`

let results = [];
let result = {};

app.use(bodyParser.json());

fetch(SEARCH_URL).then(res => res.json()).then(json => results = json.results);

let cleanResults = () => {
    results = results.map(result => {
        return {
            name: result.name,
            place_id: result.place_id,
            types: [result.types]
        }
    });
};

let cleanResult = (place) => {
    const newPlace = {
            name: place.name,
            address: place.formatted_address,
            phone_number: place.formatted_phone_number,
            rating: place.rating,
        };
    return newPlace;
    }

app.get('/places', (req, res) => {
    // QUERY = req.params.query;
    cleanResults();
    res.json(results);
});

app.get('/place', (req, res) => {
    cleanResults();
    let id = results[0].place_id;
    const PLACE_URL = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&key=${KEY}`;
    fetch(PLACE_URL).then(res => res.json()).then(json => result = json.result);
    const newResult = cleanResult(result);
    res.json(newResult);
});

app.listen(PORT, err => {
    if (err) {
        console.log(`Error starting server at port: ${PORT}`);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});