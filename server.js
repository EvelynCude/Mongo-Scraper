var express = require("express");
var bodyParser = require("body-parser");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");


var PORT = process.env.PORT || 3000;

var app = express();

var router = express.Router();

// require routes files
require("./config/routes")(router);

// Public folder = static directory
app.use(express.static(__dirname + "/public"));

app.engine("hbs", expressHandlebars({defaultLayout: "main"}));

app.set("view engine", ".hbs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(router);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/afternoon-wildwood-32656";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, function(error){
    if (error){
        console.log(error);
    }else{
        console.log("mongoose connection successful");
    }
});


//  Listen on port 
app.listen(PORT, function(){
    console.log("Listening on port: " + PORT);
});