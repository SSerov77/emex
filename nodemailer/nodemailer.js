const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");

const mail = nodemailer.createTransport({
	host: process.env.EMAIL_SERVER,
	port: parseInt(process.env.EMAIL_PORT, 10),
	secure: process.env.EMAIL_SECURE === "true",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});

mail.verify(function (err) {
	if (err) {
		console.error("Ошибка подключения к почтовому сервису: ", err);
	} else {
		console.log("Почтовый сервис подключен");
	}
});

module.exports = mail;
