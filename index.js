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
