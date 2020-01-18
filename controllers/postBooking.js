const nodemailer = require('nodemailer')
const stripe = require('stripe')(process.env.STRIPE_SK)

module.exports = (req, res) => {
	console.log('>>>>>>>',req.body.data.token.id);
	let emails = [req.body.appointment.email, 'joshuajones@trentu.ca']
	let date = req.body.appointment.dateOfPickUp
	let time = req.body.appointment.timeOfPickUp
	let transporter = nodemailer.createTransport({
		service:'gmail',
		auth:{
			user:'joshuajoneslive@gmail.com',
			pass:`${process.env.PASSWORD}`
		}
	})
	let mailOptions = {
		from: 'joshuajoneslive@gmail.com',
		to: emails,
		subject: 'Confirmation of Your Booking',
		text:
		`This email is to confirm the booking for ${req.body.appointment.firstName} ${req.body.appointment.lastName} on ${date} at ${time} UTC. If you have any further questions, do not hesitate to call us at: +1(416)496-7720. If there are any issues we will attempt to contact you at ${req.body.appointment.number}.

		Warm Regards,
		Pilot
		`
	}

	stripe.customers.create({
		email: req.body.appointment.email
	})

	stripe.charges.create({
  amount: 6000,
  currency: 'cad',
  description: 'Payment for Pilot pickup',
  source: req.body.data.token.id //I want a deeper understanding into this
}).then(charge => {
	res.send(charge)
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent:' + info.response);
		}
	})
}).catch(err=>{
	console.log('error',err);
	res.status(500).send({error: "Purchase Failed"});
})
}
