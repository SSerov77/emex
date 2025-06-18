module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User",
		{
			username: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 2,
				references: {
					model: "Roles",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "NO ACTION",
			},
		},
		{
			timestamps: true,
			updatedAt: false,
			paranoid: true,
		},
	);
	return User;
};
