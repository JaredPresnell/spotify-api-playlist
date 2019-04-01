const express = require('express');  
const bodyParser = require('body-parser');
var mongoose = require('mongoose');

const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	spotifyId: {type: String, required: true, unique: true},
	name: {type: String, required: true},
	accessToken: {type: String, required: true}, 
	refreshToken: {type: String, required: true}
});
var User = mongoose.model('User', userSchema);
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
			if(resultArray.length ==0)
				resultArray = [{spotifyId: '', name: '', accessToken: '', refreshToken: ''}];
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
		//this doesnt really make any sense but i was getting json errors and whatever
		var updatedUsers = [];
		var updatedUsersCursor = collection.find({refreshToken: req.body.refreshToken});
		updatedUsersCursor.forEach(function(doc,err){
			updatedUsers.push(doc);
		}, function(){
			client.close();
			res.json(updatedUsers[0]);
		});
	});
	

});
app.post('/api/adduser', (req, res) => {
  	//console.log(req.body);
	mongo.connect(uri, function(err, client){
		var db = client.db('spotify');
		var cursor = db.collection('users').find();	
		var collection = db.collection('users');
		collection.find({spotifyId: req.body.spotifyId}).count()
		.then((count) =>{
			if(count>0){
				console.log('duplicate user found');
				var resultsArray = [];
				cursor.forEach(function(doc, err){
					resultsArray.push(doc);
				}, function(){
					res.json(resultsArray);
					client.close();
				});
			}
			else{
				console.log('attempting to save user');
				let user = new User({
					spotifyId: req.body.spotifyId,
					name: req.body.name,
					accessToken: req.body.accessToken, 
					refreshToken: req.body.refreshToken
				});
				console.log(user);
				collection.insertOne(user); //this is definitely wrong but user.save isnt working
				// user.save()
				// 	.then(doc => {
				// 		console.log('this is the doc from user.save');
				// 		console.log(doc);
				// 	})
				// 	.catch(err => {
				// 		console.log(err);
				// 	});	
				// collection.insertOne({spotifyId: req.body.spotifyId, name: req.body.name, accessToken: req.body.accessToken, refreshToken: req.body.refreshToken})
				// .then(() => {
				// 	cursor = db.collection('users').find();
				// 	var resultsArray =[];
				// 	cursor.forEach(function(doc, err){
				// 		resultsArray.push(doc);
				// 	}, function(){
				// 		res.json(resultsArray);
				// 		client.close();
				// 	});
				
				// });
			}
		})
		
		
	});	
});

app.post('/api/testing', (req, res) => {
  console.log(req.body);
  res.send(
    'I received your POST request. This is what you sent me: ' + req.body.post,
  );
});


app.listen(port, () => console.log('Listening on port ${port}'));