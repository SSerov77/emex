const { parsePhoneNumberWithError } = require("libphonenumber-js");
module.exports = (sequelize, DataTypes) => {
	const Order = sequelize.define(
		"Order",
		{
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Users",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "NO ACTION",
			},
			phone: {
				type: DataTypes.TEXT,
				allowNull: false,
				set(value) {
					const phoneNumber = parsePhoneNumberWithError(value, "RU");
					this.setDataValue("phone", phoneNumber.format("E.164"));
				},
			},
			total_price: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
		},
		{
			timestamps: true,
			updatedAt: false,
			paranoid: true,
		},
	);
	return Order;
};
