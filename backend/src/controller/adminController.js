const db = require('../../models');
const { Order, User, Product, OrderItem } = db;
const { Op, fn, col, literal } = require('sequelize');

const getAnalytics = async (req, res) => {
  try {
    // Total sales (completed orders)
    const totalSalesResult = await Order.findOne({
      attributes: [[fn('SUM', col('totalAmount')), 'totalSales']],
      where: { status: 'completed' }
    });
    const totalSales = parseFloat(totalSalesResult.dataValues.totalSales || 0);

    // Order counts by status
    const orderCountsRaw = await Order.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status']
    });
    const orderCounts = orderCountsRaw.reduce((acc, row) => {
      acc[row.status] = parseInt(row.dataValues.count);
      return acc;
    }, {});

    // New users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);
    const newUsers = await User.count({
      where: {
        createdAt: { [Op.gte]: startOfMonth }
      }
    });

    // Most popular products (by quantity ordered)
    const popularProductsRaw = await OrderItem.findAll({
      attributes: [
        'productId',
        [fn('SUM', col('quantity')), 'totalOrdered']
      ],
      group: ['productId'],
      order: [[literal('totalOrdered'), 'DESC']],
      limit: 5,
      include: [{ model: Product, as: 'Product', attributes: ['name'] }]
    });
    const popularProducts = popularProductsRaw.map(item => ({
      productId: item.productId,
      name: item.Product?.name || '',
      totalOrdered: parseInt(item.dataValues.totalOrdered)
    }));

    res.json({
      success: true,
      analytics: {
        totalSales,
        orderCounts,
        newUsers,
        popularProducts
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getCounts = async (req, res) => {
  try {
    const [products, users, orders] = await Promise.all([
      Product.count(),
      User.count(),
      Order.count()
    ]);
    res.json({ success: true, counts: { products, users, orders } });
  } catch (error) {
    console.error('Counts error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getAnalytics, getCounts }; 