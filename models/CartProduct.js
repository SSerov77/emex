module.exports = (sequelize, DataTypes) => {
	const CartProduct = sequelize.define(
		"CartProduct",
		{
			cart_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Carts",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "NO ACTION",
			},
			product_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Products",
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
	return CartProduct;
};
