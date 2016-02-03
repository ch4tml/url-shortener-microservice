"use strict";
var randomstring = require("randomstring");
var mongo = require("mongodb").MongoClient;
var mongoose = require("mongoose");
var configDB = require("../config/database.js");
mongoose.createConnection(configDB.url);
var db = mongoose.connection;
var URL = require("../app/models/url");
/*
 * GET home page.
 */
//exports.module = function(app, mongoose, mongo, configDB){
exports.index = function(req, res){
    res.render('index', {
        title: "URL Shortener Microservice",
        author: "ch4tml"
    });
};
/*
 * GET time request and return JSON object
 */
exports.urlshortener = function(req, res){
    //var short_url = "https://ch4tml-url-ms.herokuapp.com/" + randomstring.generate(7);
    var stringGenerated = randomstring.generate(7);
    // If all well, writehead 200 with mimetype JSON*/
    res.writeHead(200, {"Content-Type" : "application/json"});
    // Create json object to return to user
    var enteredURL = new URL();
    
    enteredURL.original_url = req.params.url;
    enteredURL.short_url = "https://ch4tml-url-ms.herokuapp.com/" + stringGenerated;
    enteredURL.stringGenerated = stringGenerated;
    
    console.log(enteredURL);
    
    enteredURL.save(function(err){
        if(err) return console.error(err);
        console.log("URL saved successfully");
        console.log(enteredURL);
    });

    db.on("error", console.error.bind(console, "Connection error: "));

    var json = {
        "original_url": "http://" + req.params.url,
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
        console.log(doc["original_url"]);
        redirectUrl = doc["original_url"];
        console.log(redirectUrl);
        res.redirect("http://" + redirectUrl);
    });
};