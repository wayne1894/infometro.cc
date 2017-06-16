const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var nodemailer = require('nodemailer');

exports.mail = functions.https.onRequest((req, res) => {
	var url=req.query.url; //接收參數

	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'infometro.cc@gmail.com',
			pass: 'm14911491'
		}
	});

	var mailOptions = {
		from: 'infometro 資訊地鐵站',
		to: 'mose286778@gmail.com',
		subject: 'firebase實測',
		text: 'That was easy!'
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
			res.status(200).send('Email sent: ' + info.response);
		}
	});

});