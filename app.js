"use strict";

var express = require("express");
var app = express();
var routes = require("./routes/routes");
var bodyParser = require('body-parser');
var path = require("path");
var http = require("http");
var mongo = require("mongodb").MongoClient;
var mongoose = require("mongoose");
var configDB = require("./config/database.js");
mongoose.connect(configDB.url);
//var url = "mongodb://localhost:27017/paths";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// all environments
app.set('port', process.env.PORT || 8080);
app.use(express.favicon());
// Logs actions and requests when server running
app.use(express.logger('dev'));
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get("/", routes.index); // Home route
app.get("/new/http://:url*", routes.urlshortener); // Time query route
app.get("/:path", routes.redirect);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});