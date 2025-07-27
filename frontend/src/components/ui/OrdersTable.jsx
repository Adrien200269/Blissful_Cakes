import React, { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import Cookies from "js-cookie";

const statusColors = {
  completed: "badge-delivered",
  pending: "badge-pending",
  cancelled: "badge-cancelled",
  processing: "badge-processing",
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusMessageType, setStatusMessageType] = useState(null); // 'success' or 'error'

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || "Failed to fetch orders.");
      }
    } catch (err) {
      setError("Failed to fetch orders.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusMessage(null);
    setStatusMessageType(null);
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage("Order status updated!");
        setStatusMessageType("success");
        fetchOrders();
      } else {
        setStatusMessage(data.message || "Failed to update status.");
        setStatusMessageType("error");
      }
    } catch (err) {
      setStatusMessage("Failed to update status.");
      setStatusMessageType("error");
    }
  };
  console.log(orders);
  
  return (
    <div>
      {statusMessage && (
        <div
          style={{
            color: statusMessageType === "success" ? "#16a34a" : "#dc2626",
            background: statusMessageType === "success" ? "#f0fdf4" : "#fef2f2",
            border: `1.5px solid ${
              statusMessageType === "success" ? "#bbf7d0" : "#fecaca"
            }`,
            borderRadius: 8,
            padding: "0.7rem 1rem",
            marginBottom: 12,
            textAlign: "center",
            fontWeight: 500,
          }}>
          {statusMessage}
        </div>
      )}
      <div className="admin-table-scroll">
        {loading ? (
          <div>Loading orders...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="admin-table-cell">{order.id}</td>
                  <td className="admin-table-cell">
                    {order.user?.email || order.userId}
                  </td>
                  <td className="admin-table-cell">
  {order.orderItems && order.orderItems.length > 0
    ? order.orderItems
        .map((item) => {
          console.log(item);
          return `${item.Product.name}`;
        })
        .join(",")
    : ""}
</td>
                  <td className="admin-table-cell">Rs {order.totalAmount}</td>
                  <td className="admin-table-cell">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      style={{
                        borderRadius: 6,
                        padding: "0.2rem 0.5rem",
                        border: "1.5px solid #e9d5ff",
                        background: "#faf5ff",
                        color: "#9333ea",
                        fontWeight: 600,
                      }}>
                      <option value="pending">pending</option>
                      <option value="processing">processing</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className="admin-table-cell">{order.address}</td>
                  <td className="admin-table-cell">{order.phone}</td>
                  <td className="admin-table-cell">
                    <span className="order-note-ellipsis" title={order.note}>
                      {order.note}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <style>{`
          .admin-table-cell {
            color: #111;
          }
        `}</style>
      </div>
    </div>
  );
};

export default OrdersTable;
