require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

const app = express();

app.use(morgan('dev'));

// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter (use process.env.OMDB_API_KEY instead)

var cachingObject = {};

app.get('/', function(req, res) {
    // console.log(req.query);
    var key = Object.keys(req.query);
    var idOrTitle = Object.values(req.query);

    if (cachingObject.hasOwnProperty(idOrTitle)) {  //syntax is similar to line 19
        // console.log("caching if");
        res.send(cachingObject[idOrTitle]);
    } else {
        axios({
            url: `http://omdbapi.com/?${key}=${encodeURI(idOrTitle)}&apikey=${process.env.OMDB_API_KEY}`,
            method: 'get'
        })
        .then(function (response) {
            // console.log("first get");
            cachingObject[idOrTitle] = response.data; // creating [key] = value 
            res.send(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
});

module.exports = app;