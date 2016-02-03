"use strict";
var randomstring = require("randomstring");
var mongo = require("mongodb").MongoClient;
var mongoose = require("mongoose");
var configDB = require("../config/database.js");
mongoose.createConnection(configDB.url);
var db = mongoose.connection;
var URL = require("../app/models/url");

/* GET home page */
exports.index = function(req, res){
    res.render('index', {
        title: "URL Shortener Microservice",
        author: "ch4tml"
        //heroku:
    });
};

/* Shorten URL */
exports.urlshortener = function(req, res){
    var re = new RegExp(/^http:\/\//i);
    var validateUrl = new RegExp(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/ig);
    // Generate random string of length characters 7
    var original_url = re.test(req.params[0]) ? req.params[0] : "http://" + req.params[0];
    var stringGenerated = randomstring.generate(7);
    // If all well, writehead 200 with mimetype JSON*/
    res.writeHead(200, {"Content-Type" : "application/json"});
    var enteredURL = new URL();
    enteredURL.original_url = original_url;
    enteredURL.short_url = "https://ch4tml-url-ms.herokuapp.com/" + stringGenerated;
    enteredURL.stringGenerated = stringGenerated;

    enteredURL.save(function(err){
        if(err) return console.error(err);
        console.log("URL saved successfully");
    });

    db.on("error", console.error.bind(console, "Connection error: "));

    var json = {
        //"original_url": "http://" + req.params.url,
        "original_url": original_url,
        "short_url": enteredURL.short_url
    };
    var data = JSON.stringify(json);
    res.end(data);
};

exports.redirect = function(req, res){
    db.on("error", console.error.bind(console, "Connection error: "));
    var redirectUrl;
    URL.findOne({stringGenerated: req.params.path}, function(err, doc){
        if(err) throw err;
        redirectUrl = doc["original_url"];
        res.redirect(redirectUrl);
    });
};