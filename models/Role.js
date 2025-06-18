module.exports = (sequelize, DataTypes) => {
	const Role = sequelize.define(
		"Role",
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		},
	);
	return Role;
};
