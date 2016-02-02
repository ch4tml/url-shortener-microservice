"use strict";
/*
 * GET home page.
 */
exports.index = function(req, res){
    res.render('index', { title: 'Request Header Parser Microservice' });
};
/*
 * GET time request and return JSON object
 */
exports.whoami = function(req, res){
    // RegExp to capture OS. OS is contained within first set of parens in user-agent header
    // Aim of RegExp is to find first set of parens and capture the group that is within those parens, WITHOUT the parens being captured. This becomes second item in array
    var re = new RegExp(/\((.+?)\)/i);
    // Store request headers in new variable
    var userData = req.headers;
    // Gets first five characters from the accept-language string. These characters are the prefered language
    var language = userData["accept-language"].slice(0, 5);
    // As explained with the RegExp statement above, group captured is second item in array
    var operatingSystem = userData["user-agent"].match(re)[1];
    // If all well, writehead 200 with mimetype JSON
    res.writeHead(200, {"Content-Type" : "application/json"});
    // Create json object to return to user
    var json = {
        // Square bracket notation for non-standard property names
        "ip": userData["x-forwarded-for"],
        "language": language,
        "operating-system": operatingSystem
    };
    var data = JSON.stringify(json);
    res.end(data);
};