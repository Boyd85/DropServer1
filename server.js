import { Geolocation } from '@ionic-native/geolocation';


// Set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// Configuration
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/drop');

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Model
var Drop = mongoose.model('Drop', {
    message: String,
    long: Number,
    lat: Number
});

// Get all Drop items
app.get('/api/drop', function (req, res) {

    console.log("Listing drop items...");

    //use mongoose to get all drops in the database
    Drop.find( {"long": 150}, function (err, drop) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(drop); // return all drops in JSON format
    });
});

// Create a Drop Item
app.post('/api/drop', function (req, res) {

    console.log("Creating Drop item...");

    Drop.create({
        message: req.body.message,
        long: req.body.long,
        lat: req.body.lat,
        done: false
    }, function (err, drop) {
        if (err) {
            res.send(err);
        }

        // create and return all the drop
        Drop.find(function (err, drop) {
            if (err)
                res.send(err);
            res.json(drop);
        });
    });

});

// Update a Drop Item
app.put('/api/drop/:id', function (req, res) {
    const drop = {
        message: req.body.message,
        long: req.body.long,
        lat: req.body.lat
    };
    console.log("Updating item - ", req.params.id);
    Drop.update({_id: req.params.id}, drop, function (err, raw) {
        if (err) {
            res.send(err);
        }
        res.send(raw);
    });
});


// Delete a Drop Item
app.delete('/api/drop/:id', function (req, res) {
    Drop.remove({
        _id: req.params.id
    }, function (err, drop) {
        if (err) {
            console.error("Error deleting Drop ", err);
        }
        else {
            Drop.find(function (err, drop) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(drop);
                }
            });
        }
    });
});


// Start app and listen on port 8080  
app.listen(process.env.PORT || 8080);
console.log("Drop server listening on port  - ", (process.env.PORT || 8080));

