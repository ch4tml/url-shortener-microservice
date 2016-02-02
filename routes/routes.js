"use strict";
/*
 * GET home page.
 */
exports.index = function(req, res){
    res.render('index', {
        title: 'URL Shortener Microservice',
        author: "ch4tml"
    });
};
/*
 * GET time request and return JSON object
 */
exports.urlshortener = function(req, res){
    var short_url = "https://ch4tml-url-ms.herokuapp.com/" + Math.floor(Math.random()*10);
    // If all well, writehead 200 with mimetype JSON
    res.writeHead(200, {"Content-Type" : "application/json"});
    // Create json object to return to user
    var json = {
        // Square bracket notation for non-standard property names
        "original_url": req.params.url,
        "short_url": short_url
    };
    var data = JSON.stringify(json);
    res.end(data);
};