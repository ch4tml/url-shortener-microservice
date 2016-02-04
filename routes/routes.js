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
        //heroku: "https://ch4tml-url-ms.herokuapp.com/"
    });
};

/* Shorten URL */
exports.urlshortener = function(req, res){
    var original_url = convertUrl(req.params[0]);
    function validateUrl(url){
        var re_validateUrl = new RegExp(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/ig);
        return re_validateUrl.test(url);
    }
    function convertUrl(url){
        var re = new RegExp(/^http:\/\//i);
        return re.test(req.params[0]) ? req.params[0] : "http://" + req.params[0];
    }
    // Checks for valid URL entered, if not valid, returns error json object
    if(!validateUrl(req.params[0])){
        res.end(JSON.stringify({
            "Error": "Invalid URL entered"
        }));
    }
    else{
        // Checks if URL has already been shortened in the database
         URL.findOne({original_url: convertUrl(req.params[0])}, function(err, doc){
            if(err) throw err;
            // If a URL has already been shortened, return a json object showing the original url and short url - prevents repetition of entries in DB
            else if(doc){
                // If all well, writehead 200 with mimetype JSON*/
                res.writeHead(200, {"Content-Type" : "application/json"});
                res.end(JSON.stringify({
                    original_url: doc.original_url,
                    short_url: doc.short_url,
                }));
            }
            // If URL is valid and not currently in database, then create new short url
            else{
                // Generate random string of length characters 7
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
                    "original_url": original_url,
                    "short_url": enteredURL.short_url
                };
                
                var data = JSON.stringify(json);
                res.end(data);
            }
         });
    }
};

// Route for when user enters a previously shortened path
exports.redirect = function(req, res){
    db.on("error", console.error.bind(console, "Connection error: "));
    URL.findOne({stringGenerated: req.params.path}, function(err, doc){
        if(err) throw err;
        res.redirect(doc["original_url"]);
    });
};