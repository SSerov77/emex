const express = require("express");
const { isAdmin } = require("../middlewares");
const { sequelize, Product } = require("../models");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const crypto = require("crypto");
const router = express.Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadPath = path.join(__dirname, "../public/imgs/uploads/");
		require("fs").mkdirSync(uploadPath, { recursive: true });
		cb(null, uploadPath);
	},
	filename: function (req, file, cb) {
		const hash = crypto.createHash("sha1").update(Date.now().toString()).digest("hex").slice(0, 8);
		cb(null, "product" + hash + path.extname(file.originalname));
	},
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Этот формат не поддерживается"), false);
		}
	},
});

router.post("/", isAdmin, upload.single("photo"), async (req, res) => {
	const transaction = await sequelize.transaction();
	try {
		const { name, price } = req.body;
		if (!name || !name.trim() || isNaN(parseFloat(price))) {
			await transaction.rollback();
			return res.status(400).json({ error: "Некорректные данные товара" });
		}
		let photoPath = null;
		if (req.file) {
			const newFile = `${path.parse(req.file.filename).name}-${Date.now()}.jpeg`;
			const formattingPhoto = path.join(__dirname, "../public/imgs/uploads/", newFile);
			try {
				await sharp(req.file.path).jpeg().toFile(formattingPhoto);
				await fs.promises.unlink(req.file.path);
				photoPath = `/imgs/uploads/${newFile}`;
			} catch (err) {
				console.error("Ошибка обработки изображения:", err);
				const cleanup = async () => {
					if (formattingPhoto && fs.existsSync(formattingPhoto)) {
						await fs.promises.unlink(formattingPhoto).catch(console.error);
					}
					if (req.file?.path && fs.existsSync(req.file.path)) {
						await fs.promises.unlink(req.file.path).catch(console.error);
					}
				};
				await cleanup();
				await transaction.rollback();
				return res.status(500).json({ error: "Ошибка обработки изображения" });
			}
		}
		await Product.create(
			{
				name: name.trim(),
				price: parseFloat(price),
				photo: photoPath,
			},
			{ transaction },
		);

		await transaction.commit();
		res.redirect("/panel3");
	} catch (error) {
		await transaction.rollback().catch(console.error);
		console.error("Ошибка при добавлении товара:", error);
		const status = error instanceof multer.MulterError ? 400 : 500;
		return res.status(status).json({
			error: status === 400 ? "Ошибка загрузки файла" : "Ошибка сервера",
			details: error.message,
		});
	}
});

router.delete("/:id", isAdmin, async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findOne({ where: { id } });
		if (!product) {
			return res.status(404).json({ error: "Товар не найден" });
		}
		if (product.photo) {
			const photoPath = path.join(__dirname, "../public", product.photo);
			if (fs.existsSync(photoPath)) {
				await fs.promises.unlink(photoPath);
			}
		}
		await Product.destroy({ where: { id } });
		res.json({ message: "Товар успешно удален" });
	} catch (error) {
		console.error("Ошибка при удалении товара:", error);
		res.status(500).json({ error: "Ошибка сервера" });
	}
});

module.exports = router;
