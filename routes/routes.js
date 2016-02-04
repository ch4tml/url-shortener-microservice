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
    var re = new RegExp(/^http:\/\//i);
    var re_validateUrl = new RegExp(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/ig);
    
    var original_url = convertUrl(req.params[0]);
    //var original_url = re.test(req.params[0]) ? req.params[0] : "http://" + req.params[0];
    //console.log(original_url);
    //var x = checkIfExisting(req.params[0]);
    //console.log("Existing Obj: " + x);
    /*for(var key in x){
        console.log(x[key]);
    }*/
    //console.log("Existing Obj short_url: " + x["short_url"]);
    function validateUrl(url){
        return re_validateUrl.test(url);
    }
    
    function convertUrl(url){
        return re.test(req.params[0]) ? req.params[0] : "http://" + req.params[0];
    }
    
    // Check if URL query exists in the database
    /*function checkIfExisting(url) {
        var existingObj = {
            original_url: undefined,
            short_url: undefined
        };
        url = convertUrl(url);
        URL.findOne({original_url: url}, function(err, doc){
            if(err) throw err;
            console.log("Doc: " + doc["original_url"]);
            /*return {
                //original_url: doc.original_url,
                //short_url: doc.short_url
            };
            existingObj.original_url = doc.original_url;
            existingObj.short_url = doc.short_url;
        //}
            //console.log("EO: " + existingObj.short_url);
            //console.log("Found existing record...");
            //console.log("Returning existing object");
            //res.end(JSON.stringify(existingObj));
            //res.end(existingObj);
        });
    }*/
    //existingObj = JSON.stringify(existingObj);
    //console.log("EO2: " + JSON.stringify(existingObj));
    //console.log("Running?: " + existingObj.original_url);
    /*if(existingObj.hasOwnProperty("original_url")){
        console.log("here");
        res.end(existingObj);
    }*/
    if(!validateUrl(req.params[0])){
        res.end(JSON.stringify({
            "Error": "Invalid URL entered"
        }));
    }
    /*else if(validateUrl.test(req.params[0])){
        db.on("error", console.error.bind(console, "Connection error: "));
        URL.findOne({original_url: req.params[0]}, function(err, doc){
            if(err) throw err;
            //redirectUrl = doc["original_url"];
            console.log(doc);
            res.end(doc);
        });
    }*/
    else{
         URL.findOne({original_url: convertUrl(req.params[0])}, function(err, doc){
            if(err) throw err;
            if(doc){
                console.log("Doc: " + doc["original_url"]);
                res.end(JSON.stringify({
                    original_url: doc.original_url,
                    short_url: doc.short_url,
                }));
            }
            else{
                // Generate random string of length characters 7
                //var original_url = re.test(req.params[0]) ? req.params[0] : "http://" + req.params[0];
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

exports.redirect = function(req, res){
    db.on("error", console.error.bind(console, "Connection error: "));
    var redirectUrl;
    URL.findOne({stringGenerated: req.params.path}, function(err, doc){
        if(err) throw err;
        //redirectUrl = doc["original_url"];
        res.redirect(doc["original_url"]);
    });
};