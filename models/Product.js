module.exports = (sequelize, DataTypes) => {
	const Product = sequelize.define(
		"Product",
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			price: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			photo: {
				type: DataTypes.STRING,
				defaultValue: "/imgs/default-avatar.jpg",
			},
		},
		{
			timestamps: true,
			updatedAt: false,
			paranoid: true,
		},
	);
	return Product;
};
