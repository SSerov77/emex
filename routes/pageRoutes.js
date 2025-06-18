const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../middlewares");
const { User, Product, Review, Cart, CartProduct } = require("../models");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
	const firstProducts = await Product.findAll({
		where: {
			id: {
				[Op.not]: [5, 6, 7],
			},
		},
	});

	const middleProduct = await Product.findOne({
		where: { name: "Двигатель ВАЗ 21116 столб для Лада Приора" },
	});
	const lastProducts = await Product.findAll({
		where: {
			id: [6, 7],
		},
	});
	if (req.session.user) {
		res.render("index", {
			user: req.session.user,
			firstProducts: firstProducts,
			middleProduct: middleProduct,
			lastProducts: lastProducts,
		});
	} else {
		res.render("index", { firstProducts: firstProducts, middleProduct: middleProduct, lastProducts: lastProducts });
	}
});

router.get("/reviews", async (req, res) => {
	const reviews = await Review.findAll({
		where: { deletedAt: null },
	});
	res.render("reviews", { reviews: reviews });
});

router.get("/dost", isAuth, async (req, res) => {
	try {
		const cart = await Cart.findOne({
			where: { user_id: req.session.user.id },
			include: [
				{
					model: CartProduct,
					include: [Product],
				},
			],
		});
		if (!cart) {
			return res.render("dost", {
				data: {
					total_orders: 0,
					total_price: "0.00",
					orders: [],
				},
			});
		}
		const items = cart.CartProducts.map((item) => ({
			id: item.id,
			product: {
				id: item.Product.id,
				name: item.Product.name,
				price: item.Product.price,
				photo: item.Product.photo,
			},
			quantity: item.quantity || 1,
			item_price: item.Product.price,
			total_price: (item.Product.price * (item.quantity || 1)).toFixed(2),
		}));
		const totalPrice = items.reduce((sum, item) => {
			return sum + parseFloat(item.total_price);
		}, 0);

		const data = {
			total_items: items.length,
			total_price: totalPrice.toFixed(2),
			items: items,
			cart_id: cart.id,
		};

		res.render("dost", { data: data });
	} catch (error) {
		console.error("Ошибка при получении корзины:", error);
		res.status(500).send("Произошла ошибка");
	}
});

router.get("/panel", isAdmin, async (req, res) => {
	const reviews = await Review.findAll();
	res.render("panel", { reviews: reviews });
});

router.get("/panel2", isAdmin, async (req, res) => {
	const users = await User.findAll();
	res.render("panel2", { users: users });
});

router.get("/panel3", isAdmin, async (req, res) => {
	const products = await Product.findAll({
		where: {
			id: {
				[Op.not]: [5, 6, 7],
			},
		},
	});
	res.render("panel3", { products: products });
});

module.exports = router;
