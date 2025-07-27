const db = require("../models");
const { Order, OrderItem, User, Product } = db;

// Create a new order
const createOrder = async (req, res) => {
  try {
    console.log(req.body);

    const { products, address, phone, note } = req.body;
    const userId = req.user.userId;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No products in order." });
    }
    if (!address || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Address and phone are required." });
    }
    // Calculate total amount
    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findByPk(item.productId);
      if (!product)
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      totalAmount += product.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      userId,
      status: "pending",
      totalAmount,
      address,
      phone,
      note,
    });
    console.log("Order created:", order);

    // Create order items
    for (const item of products) {
      const product = await Product.findByPk(item.productId);
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: { exclude: ["password"] } },
        {
          model: Product,
          through: { attributes: ["quantity", "price"] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    order.status = status;
    await order.save();
    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { createOrder, getAllOrders, updateOrderStatus };
