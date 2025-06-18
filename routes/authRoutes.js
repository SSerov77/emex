const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { User } = require("../models");

router.post("/register", async (req, res) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			return res.status(400).json({ message: "Все поля обязательны" });
		}

		const existingEmail = await User.findOne({ where: { email } });
		if (existingEmail) {
			return res.status(400).json({ message: "Аккаунт с такой почтой уже существует" });
		}

		const existingUsername = await User.findOne({ where: { username } });
		if (existingUsername) {
			return res.status(400).json({ message: "Аккаунт с таким именем уже существует" });
		}

		const newUser = await User.create({
			username: username,
			email: email,
			password: password,
		});

		req.session.user = {
			id: newUser.id,
			username: newUser.username,
			email: newUser.email,
			role: "user",
		};
		return res.status(201).json({ message: "Пользователь зарегистрирован", user: newUser });
	} catch (error) {
		return res.status(500).json({ message: "Ошибка при регистрации" });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "Email и пароль обязательны" });
		}

		const user = await User.findOne({ where: { email, deletedAt: null } });
		if (!user) {
			return res.status(401).json({ message: "Неверный email или пароль" });
		}
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({ message: "Неверный email или пароль" });
		}
		req.session.user = {
			id: user.id,
			username: user.username,
			email: user.email,
			role: user.role_id == 1 ? "admin" : "user",
		};
		return res.status(201).json({ message: "Пользователь авторизован", user: req.session.user });
	} catch (error) {
		return res.status(500).json({ message: "Ошибка при авторизаци" });
	}
});

router.post("/logout", async (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).json({ message: "Ошибка при выходе" });
		}
		res.redirect("/");
	});
});

module.exports = router;
