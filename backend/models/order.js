const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Order.belongsToMany(models.Product, {
        through: 'OrderItems',
        foreignKey: 'orderId',
        as: 'products'
      });
    }
  }
  
  Order.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Order',
    timestamps: true
  });

  return Order;
};
