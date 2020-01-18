const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const stripe = require("stripe")(process.env.STRIPE_SK);
const Pusher = require('pusher')
const app = express()

require('dotenv').config()

var pusher = new Pusher({
  appId: '933776',
  key: '5ffac5a536d422ac9f12',
  secret: '615992ea74dd03e66322',
  cluster: 'us2',
  encrypted: true
});

pusher.trigger('my-channel', 'my-event', {
  "message": "hello world"
});

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(cors())

app.listen(4000, () => {
	console.log('Listening on port 4000');
})

app.post('/booking', require('./controllers/postBooking.js'))

app.post('/pusher/auth', (req, res) => {
		let socketId = req.body.socket_id;
		let channel = req.body.channel_name;
		random_string = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
		let presenceData = {
				user_id: random_string,
				user_info: {
						username: '@' + random_string,
				}
		};
		let auth = pusher.authenticate(socketId, channel, presenceData);
		res.send(auth);
});

app.post('/update-location', (req, res) => {
		// trigger a new post event via pusher
		pusher.trigger('presence-channel', 'location-update', {
				'username': req.body.username,
				'location': req.body.location
		})
		res.json({ 'status': 200 });
});
