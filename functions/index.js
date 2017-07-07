var cors = require('cors');
const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var nodemailer = require('nodemailer');
//https://firebase.google.com/docs/functions/http-events
exports.mail = functions.https.onRequest((req, res) => {
	var corsFn = cors();
	corsFn(req, res, function() {
		var email=req.body.email; //接收參數
		var subject =req.body.subject;
		var html=req.body.html;
		var attachments= req.body.attachments

		var transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: { //填上你的gmail和密碼，gamil 必需設定 允許安全性較低的應用程式存取您的帳戶 方可寄信。
				user: 'your_email@gmail.com',
				pass: '密碼'
			}
		});

		var mailOptions = {
			from: 'infometro 資訊地鐵站', //收件者
			to: email, 
			subject: subject, //主旨
	//		text: text,
			html: html,
	    attachments: [ {
	      filename: 'file.txt',
	      content: attachments
	    }]
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
});