var express = require("express");
var router = express.Router();
var mongojs = require("mongojs");
var MongoClient = require("mongodb").MongoClient;
var MONGO_URL = "mongodb://crpd:kamikaze69@ds014808.mlab.com:14808/short";

/* GET home page. */
router.get("/", function(req, res, next) {
	res.render("index", { title: "Timestamp Microservice" });
});

// To insert
router.get("/new/:url(*)", function(req, res, next) {
	MongoClient.connect(MONGO_URL, (err, client) => {
		if (err) {
			return console.log(err);
		}
		var db = client.db("short");

		var generate = Math.floor(Math.random() * 9999999999).toString();

		db.collection("short").insertOne(
			{
				original: req.params.url,
				short: "http://rp-short.herokuapp.com/use/" + generate,
				generate: generate
			},
			function(err, res) {
				if (err) {
					return console.log(err);
				}
			}
		);
		res.json({
			original: req.params.url,
			short: "http://rp-short.herokuapp.com/use/" + generate
		});
	});
});

// To use
router.get("/use/:short", function(req, res, next) {
	MongoClient.connect(MONGO_URL, (err, client) => {
		if (err) {
			return console.log(err);
		}
		var db = client.db("short");
		db.collection("short").findOne({ generate : req.params.short }, function(err, result) {
			if (err) throw err;
			if (result.original.slice(0,7)=="http://"||result.original.slice(0,8)=="https://") {
				res.redirect(result.original);
			}
			else {
				res.redirect("http://"+result.original);
			}			
		});
	});
});

module.exports = router;