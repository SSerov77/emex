module.exports = (sequelize, DataTypes) => {
	const OrderItem = sequelize.define(
		"OrderItem",
		{
			order_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Orders",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "NO ACTION",
			},
		},
		{
			timestamps: false,
		},
	);
	return OrderItem;
};
