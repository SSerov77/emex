module.exports = (sequelize, DataTypes) => {
	const Cart = sequelize.define(
		"Cart",
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
		},
		{
			timestamps: true,
			updatedAt: false,
			paranoid: false,
		},
	);
	return Cart;
};
