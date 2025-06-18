const express = require("express");
const { sequelize, Order, OrderItem, Cart, CartProduct, User, Product } = require("../models");
const router = express.Router();
const { isAuth } = require("../middlewares");
const mail = require("../nodemailer/nodemailer");

router.post("/", isAuth, async (req, res) => {
	const { total_price, phone } = req.body;

	if (!total_price || !phone) {
		return res.status(400).json({ message: "Не указаны все значения" });
	}

	let transaction;
	try {
		transaction = await sequelize.transaction();
		const findCart = await Cart.findOne({
			where: { user_id: req.session.user.id },
			transaction,
		});

		if (!findCart) {
			await transaction.rollback();
			return res.status(404).json({ message: "Корзина не найдена" });
		}
		const allProducts = await CartProduct.findAll({
			where: { cart_id: findCart.id },
			include: [
				{
					model: Product,
					as: "Product",
					attributes: ["id", "name", "price"],
				},
			],
			transaction,
		});
		const newOrder = await Order.create(
			{
				user_id: req.session.user.id,
				phone: phone,
				total_price: total_price,
			},
			{ transaction },
		);
		await Promise.all(
			allProducts.map((item) =>
				OrderItem.create(
					{
						order_id: newOrder.id,
						product_id: item.product_id,
					},
					{ transaction },
				),
			),
		);
		await CartProduct.destroy({
			where: { cart_id: findCart.id },
			transaction,
		});
		const sendUser = await User.findOne({
			where: { id: req.session.user.id },
			attributes: ["email"],
			transaction,
		});
		if (!sendUser || !sendUser.email) {
			await transaction.rollback();
			return res.status(404).json({ message: "Email пользователя не найден" });
		}

		const emailHtml = `
            <div>
                <h1>Ваш заказ успешно оформлен</h1>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 15px;">
                    <h3>Детали заказа:</h3>
					<p><strong>Номер заказа:</strong> ${newOrder.id}</p>
                    <p><strong>Номер телефона:</strong> ${phone}</p>
                    <h4>Товары:</h4>
                    ${allProducts
											.map(
												(product) => `
                        <div style="margin-bottom: 10px;">
                            ${product.Product?.name || "Неизвестный товар"} - ${product.Product?.price || "0"} руб.
                        </div>
                    `,
											)
											.join("")}
                    <div style="font-weight: bold; font-size: 1.2em; margin-top: 15px;">
                        Итого: ${total_price} руб.
                    </div>
                </div>
            </div>
        `;
		await transaction.commit();

		try {
			await mail.sendMail({
				to: sendUser.email,
				from: process.env.EMAIL_USER,
				subject: `Emex`,
				html: emailHtml,
			});
		} catch (emailError) {
			console.error("Ошибка отправки письма:", emailError);
		}

		res.status(201).json({
			message: "Заказ успешно сформирован",
			orderId: newOrder.id,
		});
	} catch (error) {
		console.error("Ошибка при создании заказа:", error);
		if (transaction) await transaction.rollback();
		res.status(500).json({
			message: "Произошла ошибка при создании заказа",
		});
	}
});

module.exports = router;
