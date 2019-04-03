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
  			if(users.length==0){
  				usersArray = [{spotifyId: '', name:'',accessToken:'',refreshToken:''}]; 
  			}
  			else usersArray = users;
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
		User.find({spotifyId: req.body.spotifyId}).then((res)=>{
			if(res.length==0){
				user.save((err, user) => {
					if (err) return console.error(err);
					console.log(user.name + 'saved to database');
					doEverything();
				});	
			}
			
		});
	});
});

app.listen(port, () => {
	console.log('Listening on port ${port}');
	//DoEverything();

	
	function updateTimer(){
		var d = new Date();
		var day = d.getDay();
		var minutes = d.getMinutes();
		var hours = d.getHours();
		console.log('day: ' + day);
		console.log("hours: " + hours);
		console.log('minutes: ' + minutes);
		if(day==5 && hours==0){
			doEverything();
		}
	}
	setInterval(updateTimer, 60*30*1000);
	//friday morning maybe? not sure
	//do everything might need like a conditional really so its not just calling the db all the time?
  	

	
});	
function doEverything(){
	//DoEverything gets users from database, refreshes all tokens, fetches tracks for all users, updates the playlist with tracks 
	// It would be more readable to make each individual promise/map function into its own function
	mongoose.connect(uri, {useNewUrlParser: true});
	var db = mongoose.connection;
	db.once('open', function(){	
		var jaredAccessToken = '';
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
					users.forEach((user)=>{
						if(user.spotifyId==="waytoofatdolphin")
						{
							jaredAccessToken = user.accessToken;
						}
					});
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
						var trackUris = [];
						songs.forEach((userSongs)=>{
							userSongs.body.items.forEach((item)=>{
								trackUris.push(item.uri);
								totalTracks.push(item.name);
							});
						});
						console.log(totalTracks);	
						const playlist_id = '674PhRT9Knua4GdUkgzTel';
						spotifyApi.setAccessToken(jaredAccessToken);
						spotifyApi.replaceTracksInPlaylist(playlist_id, trackUris)
						.then((res)=> {
							console.log(res);
						});

					});
				});
			});
		});
	});		
}	
