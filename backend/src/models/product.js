'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsToMany(models.Order, { through: models.OrderItem });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    description: DataTypes.TEXT,
    image: DataTypes.TEXT,
    rating: DataTypes.FLOAT,
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products'  // Add this line to force lowercase table name
  });
  return Product;
};
