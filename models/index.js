const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

const Role = require("./Role")(sequelize, DataTypes);
const User = require("./User")(sequelize, DataTypes);
const Order = require("./Order")(sequelize, DataTypes);
const Product = require("./Product")(sequelize, DataTypes);
const Review = require("./Review")(sequelize, DataTypes);
const Cart = require("./Cart")(sequelize, DataTypes);
const CartProduct = require("./CartProduct")(sequelize, DataTypes);
const OrderItem = require("./OrderItem")(sequelize, DataTypes);

User.beforeCreate(async (user) => {
	user.password = await bcrypt.hash(user.password, 12);
});

User.afterCreate(async (user) => {
	await Cart.create({
		user_id: user.id,
	});
});

User.belongsTo(Role, { foreignKey: "role_id" });
Role.hasMany(User, { foreignKey: "role_id" });
Order.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Order, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });
User.hasOne(Cart, { foreignKey: "user_id" });
Cart.hasMany(CartProduct, { foreignKey: "cart_id" });
CartProduct.belongsTo(Cart, { foreignKey: "cart_id" });
Product.hasMany(CartProduct, { foreignKey: "product_id" });
CartProduct.belongsTo(Product, { foreignKey: "product_id" });
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });
Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

module.exports = {
	sequelize,
	Role,
	User,
	Order,
	OrderItem,
	Product,
	Review,
	Cart,
	CartProduct,
};
