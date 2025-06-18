require("dotenv").config();
const { sequelize, Role, User, Product, Review } = require("./models");
const path = require("path");
const hbs = require("hbs");
const express = require("express");
const session = require("express-session");
const apiOrderRoutes = require("./routes/orderRoutes");
const apiReviewRoutes = require("./routes/reviewRoutes");
const apiCartProductRoutes = require("./routes/cartProductRoutes");
const apiAuthRoutes = require("./routes/authRoutes");
const productsRoutes = require("./routes/productsRoutes");
const pageRoutes = require("./routes/pageRoutes");

const isDev = process.env.NODE_ENV == "dev" ? true : false;
const SESSION_SECRET = process.env.SESSION_SECRET;
const app = express();

hbs.registerHelper("formatDate", function (date) {
	if (!date) return "";

	return new Date(date).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
});

app.use(
	session({
		name: "session",
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 24 * 60 * 60 * 1000,
		},
	}),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
if (!isDev) {
	const publicPath = path.join(__dirname, "public");
	const cssPath = path.join(publicPath, "css");
	const imagePath = path.join(publicPath, "imgs");
	const jsPath = path.join(publicPath, "js");
	app.use(
		"/css",
		express.static(cssPath, {
			maxAge: "30d",
		}),
	);
	app.use(
		"/imgs",
		express.static(imagePath, {
			maxAge: "30d",
		}),
	);
	app.use(
		"/js",
		express.static(jsPath, {
			maxAge: "30d",
		}),
	);
}
app.use(express.static("public"));
app.use("/api/orders", apiOrderRoutes);
app.use("/api/reviews", apiReviewRoutes);
app.use("/api/cartproducts", apiCartProductRoutes);
app.use("/api/auth", apiAuthRoutes);
app.use("/api/products", productsRoutes);
app.all("*", pageRoutes);

(async () => {
	try {
		await sequelize.authenticate();
		if (isDev) {
			await sequelize.sync({ force: true });
		} else {
			await sequelize.sync();
		}

		const findAdmin = await Role.findOne({
			where: { name: "admin" },
		});
		if (!findAdmin) {
			const role_admin = await Role.create({
				name: "admin",
			});
			const role_user = await Role.create({
				name: "user",
			});

			const admin = await User.create({
				username: "admin",
				email: "admin@mail.ru",
				password: "admin",
				role_id: role_admin.id,
			});
			const user = await User.create({
				username: "user",
				email: "user@mail.ru",
				password: "user",
				role_id: role_user.id,
			});

			await Review.create({
				name: "Вадим Матвеев",
				text: "Недавно посетил автомагазин «АвтоМир», и у меня остались только положительные впечатления! Во-первых, ассортимент товаров просто впечатляющий. Здесь можно найти все — от автомобильных запчастей до аксессуаров и мойки. Я искал тормозные колодки для своего автомобиля, и консультант быстро помог мне подобрать нужные детали",
				photo: "/imgs/первый отз.jpg",
			});
			await Review.create({
				name: "Денис Дильмухаметов",
				text: "Организация работы магазина на высшем уровне. Персонал вежливый и профессиональный. Мне удалось быстро получить консультацию, и сотрудники охотно ответили на все мои вопросы",
				photo: "/imgs/второй отз.jpg",
				createdAt: new Date(2024, 7, 10),
			});

			const product = await Product.create({
				name: "Щётка стеклоочистителя",
				price: 385.0,
				photo: "/imgs/stekl.jpg",
			});
			const product2 = await Product.create({
				name: "ШРУС АвтоВАЗ внешний",
				price: 590.0,
				photo: "/imgs/sot2.jpg",
			});
			const product3 = await Product.create({
				name: "Экран двигателя АвтоВАЗ",
				price: 1270.0,
				photo: "/imgs/sot3.jpg",
			});
			const product4 = await Product.create({
				name: "Комплект ГРМ АвтоВАЗ Gates",
				price: 9900.0,
				photo: "/imgs/sot4.jpg",
			});

			const product5 = await Product.create({
				name: "Двигатель ВАЗ 21116 столб для Лада Приора",
				price: 97990.0,
				photo: "/imgs/img4.png",
			});

			const product6 = await Product.create({
				name: "Полироль Fantom Ultra",
				price: 1300.0,
				photo: "/imgs/brand.jpg",
			});
			const product7 = await Product.create({
				name: "Тряпка микрофибра 1шт",
				price: 150.0,
				photo: "/imgs/micr.jpg",
			});
		}
	} catch (error) {
		console.log("Ошибка при заполнении данных в бд:", error);
	}
})();

app.listen(3000);
