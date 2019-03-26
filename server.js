const express = require('express');  
const bodyParser = require('body-parser');
var mongoose = require('mongoose');

const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');

//there's some weird shit with mongo where it used to return a db and now it returns client, after v3.0
const uri = "mongodb://localhost:27017/spotify";


const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));		

app.get('/api/getusers', (req, res) => {
	var resultArray = [];
	mongo.connect(uri, function(err, client){
		var db = client.db('spotify');
		var cursor = db.collection('users').find();
		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
			client.close();
			//console.log(resultArray);
			res.json(resultArray);
		});
	});	
});

app.post('/api/edituser',(req, res) => {
	mongo.connect(uri, function(err, client){
		var db = client.db('spotify');
		var collection = db.collection('users');
		collection.updateOne(
			{refreshToken: req.body.refreshToken},
			{'$set': {'accessToken':req.body.accessToken}}, 
			(err, item) => {console.log(item)
		});
	});
});
app.post('/api/adduser', (req, res) => {
  console.log(req.body);
  var resultArray = [];
	mongo.connect(uri, function(err, client){
		var db = client.db('spotify');
		var cursor = db.collection('users').find();	
		console.log(req.body.accessToken);
		console.log(req.body.refreshToken);
		db.collection('users').insert({name: req.body.name, accessToken: req.body.accessToken, refreshToken: req.body.refreshToken});
		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
			client.close();
			//console.log(resultArray);
			//res.json({users: resultArray});
			res.json(resultArray);
		});
	});	
});

app.post('/api/testing', (req, res) => {
  console.log(req.body);
  res.send(
    'I received your POST request. This is what you sent me: ' + req.body.post,
  );
});


app.listen(port, () => console.log('Listening on port ${port}'));