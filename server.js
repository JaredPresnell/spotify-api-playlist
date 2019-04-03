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
const uri = "mongodb://localhost:27017/spotify";

var Spotify = require('spotify-web-api-node');
const spotifyApi = new Spotify();

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));		

const fetch = require('node-fetch');
var Bluebird = require('bluebird');
fetch.Promise = Bluebird;

app.get('/api/getusers', (req, res) => {
	mongoose.connect(uri, {useNewUrlParser: true});
	var db = mongoose.connection;
  	db.on('error', console.error.bind(console, 'connection error:'));
  	db.once('open', function(){
  		var usersArray = [];
  		User.find({}, function(err, users){
  			usersArray = users;
  			res.json(usersArray);
  		});
  		
  	});
});

app.post('/api/edituser',(req, res) => {
	mongoose.connect(uri, {useNewUrlParser: true});
	var db = mongoose.connection;
  	db.on('error', console.error.bind(console, 'connection error:'));
  	let query = {refreshToken: req.body.refreshToken};
	db.once('open', function() {
		User.findOneAndUpdate(query, {accessToken: req.body.accessToken}, {upsert: false, new: true}, 
			function(err,doc){	
				if(err) return res.send(500, {error: err});
				return res.send(doc);
		});
	});
	

});
app.post('/api/adduser', (req, res) => {
  	mongoose.connect(uri, {useNewUrlParser: true});
  	var db = mongoose.connection;
  	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
	  	let user = new User({
			spotifyId: req.body.spotifyId,
			name: req.body.name,
			accessToken: req.body.accessToken, 
			refreshToken: req.body.refreshToken
		});
		user.save((err, user) => {
			if (err) return console.error(err);
			console.log(user.name + 'saved to database');
		});
	});
});

app.listen(port, () => {
	console.log('Listening on port ${port}');
	mongoose.connect(uri, {useNewUrlParser: true});
  	var db = mongoose.connection;
  	var BluebirdTest = Bluebird.promisify(User.find);

	//FetchUsers();


	db.once('open', function(){
		User.find({}).then((users)=>{
			var tokensPromiseArray = users.map((user) =>{
				var refreshToken = user.refreshToken;
				console.log('user id: ' + user.spotifyId);
				return fetch('http://localhost:8888/refresh_token?refresh_token=' + refreshToken, {
	        		method: 'GET',
		      	})
		 	 	.then(function(res){
		      		return res.json();
		      	});
			});
			Promise.all(tokensPromiseArray).then((tokens)=>{
				console.log('fetch tokens finished');
				var updateDBPromises = tokens.map((token) =>{
					let accessToken = token.access_token;
					let refreshToken = token.refresh_token;
					let query = {refreshToken: refreshToken};
					return User.findOneAndUpdate(query, {accessToken: accessToken}, {upsert: false, new: true}).exec();
				});
				Promise.all(updateDBPromises).then((users)=>{
					console.log('database updated');
					var totalTracks = [];
					var spotifyPromises = users.map((user)=>{
						spotifyApi.setAccessToken(user.accessToken);
						const options = {limit: 5, offset: 0, time_range: 'short_term'};
						console.log('calling spotify');
						return spotifyApi.getMyTopTracks(options).then((data) => {
							return data;
						});
							
					});
					Promise.all(spotifyPromises).then((songs)=>{
						console.log('spotify done');
						var totalTracks = [];
						songs.forEach((userSongs)=>{
							userSongs.body.items.forEach((item)=>{
								totalTracks.push(item.name);
							});
						});
						console.log(totalTracks);	
					});
				});
			});
		});
	});
	
	

  	//SIGN IN CODEFLOW:
  	//
  	//user signs in in react -> spotify oauth
  	//redirect to react -> gethashparams -> posts to node -> calls DoEverything()
  	function FetchUsers(){
		var usersArray = [];

  		mongoose.connect(uri, {useNewUrlParser: true});
  		var db = mongoose.connection;
  		db.on('error', console.error.bind(console,'connection error'));
  		console.log('inside FetchUsers()');
  		db.once('open', function(){
  			User.find({}, function(err, users){
  				usersArray = users;
  				//console.log(usersArray);
  				//get new access tokens
  				usersArray.forEach((user, index) =>{
  					var refreshToken = user.refreshToken;
					fetch('http://localhost:8888/refresh_token?refresh_token=' + refreshToken, {
		        		method: 'GET',
			      	})  
			 	 	.then(function(res){
			      		return res.json();
			      	})
			      	.then(function(resJSON){
			      		let accessToken = resJSON.access_token;
		      		  	let query = {refreshToken: refreshToken};
			      		User.findOneAndUpdate(query, {accessToken: accessToken}, {upsert: false, new: true}, 
							function(err,doc){	
								if(err) console.log(err);
								//console.log('user token updated');
								//console.log(doc);
								return "hello there@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2";
						});
			      	});
  				});
  				
  			});
  			
  		});
  		
  		
  	}
  	// DoEverything():
  		//get users from database
	  	//refresh all tokens
	  	//get songs for everyone from spotify (or not depending on how you want to do it)
	  	//compile songs into one array, check for duplicates
	  	//push songs to spotify


  		//this shit is for later 	
  		// probably need to actually fairly frequently run an interval, once every hour or something, and then check if it is the right day of the week or whatever
 	//  function intervalFunc() {
	//   console.log('Cant stop me now!');
	// }

	// setInterval(intervalFunc, 3000);
});	

