const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      // No direct associations needed as this is a junction table
    }
  }
  
  OrderItem.init({
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OrderItem',
    timestamps: true
  });

  return OrderItem;
};
