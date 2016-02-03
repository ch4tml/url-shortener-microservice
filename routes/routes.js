"use strict";
/*var randomstring = require("randomstring");
var mongo = require("mongodb").MongoClient;
var mongoose = require("mongoose");
var configDB = require("../config/database.js");
mongoose.connect(configDB.url);
*//*
 * GET home page.
 */
exports.module = function(app, mongoose, mongo, configDB){
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
        mongo.connect(configDB.url, function(err, db){
            if(err) throw err;
            else{
                db.collection("paths").find({},
                {_id : 0})
                .toArray(function(err, documents){
                    if(err)
                        throw err;
                    else{
                        var json = JSON.stringify(documents);
                        res.end(json);
                    }
                    db.close();
                });
                /*, function(err, docs){
                    if(err) throw err;
                    console.log(docs);
                    res.end(docs);
                    db.close();
                });*/
            }
        });
        /*var short_url = "https://ch4tml-url-ms.herokuapp.com/" + Math.floor(Math.random()*10);
        // If all well, writehead 200 with mimetype JSON*/
        /*res.writeHead(200, {"Content-Type" : "application/json"});
        // Create json object to return to user
        var json = {
            // Square bracket notation for non-standard property names
            "original_url": req.params.url,
            "short_url": short_url
        };
        var data = JSON.stringify(json);
        console.log(data);
        console.log(json);
        res.end(data);*/
    };
};