const express = require("express");
const { Cart, CartProduct } = require("../models");
const router = express.Router();
const { isAuth } = require("../middlewares");

router.post("/", isAuth, async (req, res) => {
	const { product_id } = req.body;

	if (!product_id) {
		return res.status(400).json({ message: "Не указан идентификатор товара" });
	}

	const findCart = await Cart.findOne({
		where: { user_id: req.session.user.id },
	});

	const newProduct = await CartProduct.create({
		cart_id: findCart.id,
		product_id: product_id,
	});

	res.json({ message: "Товар добавлен в корзину", newProduct: newProduct });
});

router.post("/:id", isAuth, async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ message: "Не указан идентификатор товара" });
	}
	await CartProduct.destroy({
		where: { id: id },
	});

	res.redirect("/dost");
});

module.exports = router;
