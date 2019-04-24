This is the github repo for an app I built using the Spotify API called Friends Feed. 

You can view the project at https://www.jaredpresnell.me/spotify

Friends Feed is an app I built to discover music from friends and people that I meet. Essentially how it works is, when someone signs up through the webpage, my app receives an access token to their Spotify account, which allows me to access their data from Spotify. The app saves all users' tokens to a database, and then uses these tokens to get each user's top 5 most played songs from the last month. These songs are embedded in the webpage, as well as pushed to a playlist on Spotify. The playlist automatically updates every Friday, or whenever a new user signs in. 

You can view the backend code for this project at https://github.com/JaredPresnell/spotify_backend. 

