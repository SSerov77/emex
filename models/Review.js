module.exports = (sequelize, DataTypes) => {
	const Review = sequelize.define(
		"Review",
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			text: {
				type: DataTypes.TEXT,
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
	return Review;
};
