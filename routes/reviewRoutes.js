const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const sharp = require("sharp");
const { sequelize, Review } = require("../models");
const { isAdmin } = require("../middlewares");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadPath = path.join(__dirname, "../public/imgs/uploads/");
		require("fs").mkdirSync(uploadPath, { recursive: true });
		cb(null, uploadPath);
	},
	filename: function (req, file, cb) {
		const hash = crypto.createHash("sha1").update(Date.now().toString()).digest("hex").slice(0, 8);
		cb(null, "review" + hash + path.extname(file.originalname));
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

// Роут для добавления отзыва
router.post("/", upload.single("file"), async (req, res) => {
	const transaction = await sequelize.transaction();

	try {
		const { name, text } = req.body;
		if (!name?.trim() || !text?.trim()) {
			await transaction.rollback();
			return res.status(400).json({ error: "Имя и текст отзыва обязательны" });
		}
		let photoPath = "/imgs/default-avatar.jpg";
		if (req.file) {
			const newFile = `${path.parse(req.file.filename).name}-${Date.now()}.jpeg`;
			const formattingPhoto = path.join(__dirname, "../public/imgs/uploads/", newFile);
			try {
				await sharp(req.file.path).jpeg().toFile(formattingPhoto);
				await fs.promises.unlink(req.file.path);
				photoPath = `/imgs/uploads/${newFile}`;
			} catch (err) {
				console.error("Ошибка обработки изображения:", err);
				const cleanups = [];
				if (req.file?.path) cleanups.push(fs.promises.unlink(req.file.path).catch(console.error));
				if (formattingPhoto) cleanups.push(fs.promises.unlink(formattingPhoto).catch(console.error));

				await Promise.all(cleanups);
				await transaction.rollback();
				return res.status(500).json({ error: "Ошибка обработки изображения" });
			}
		}
		await Review.create(
			{
				name: name.trim(),
				text: text.trim(),
				photo: photoPath,
			},
			{ transaction },
		);
		await transaction.commit();
		res.redirect("/reviews");
	} catch (error) {
		await transaction.rollback().catch(console.error);
		console.error("Ошибка при создании отзыва:", error);
		const status = error instanceof multer.MulterError ? 400 : 500;
		res.status(status).json({
			error: status === 400 ? "Ошибка загрузки файла" : "Ошибка сервера",
			details: error.message,
		});
	}
});

// Роут для получения отзывов
router.get("/", async (req, res) => {
	try {
		const reviews = await Review.findAll({
			order: [["id", "DESC"]],
		});
		res.json(reviews);
	} catch (error) {
		console.error("Ошибка при получении отзывов:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.delete("/:id", isAdmin, async (req, res) => {
	try {
		const id = req.params.id;
		const result = await Review.destroy({
			where: { id: id },
		});
		if (result === 0) {
			return res.status(404).json({ message: "Отзыв не найден" });
		}
		res.json({ message: "Отзыв успешно удален" });
	} catch (error) {
		console.error("Ошибка при удалении отзыва:", error);
		res.status(500).json({ message: "Произошла ошибка при удалении отзыва" });
	}
});

module.exports = router;
