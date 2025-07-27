import React, { useState } from "react";
import AddProductForm from "../components/ui/AddProductForm";
import OrdersTable from "../components/ui/OrdersTable";
import UsersTable from "../components/ui/UsersTable";
import ProductsTable from "../components/ui/ProductsTable";
import blissfulLogo from "../assets/blissful-logo.jpg";
import {
  ShoppingBag,
  ClipboardList,
  Users,
  PlusCircle,
  BarChart2,
} from "lucide-react";
import "./adminpage.css";
import Cookies from "js-cookie";

const tabData = [
  {
    key: "addProduct",
    label: "Add Product",
    icon: <PlusCircle size={18} style={{ marginRight: 8 }} />,
  },
  {
    key: "products",
    label: "Products",
    icon: <ShoppingBag size={18} style={{ marginRight: 8 }} />,
  },
  {
    key: "orders",
    label: "Orders",
    icon: <ClipboardList size={18} style={{ marginRight: 8 }} />,
  },
  {
    key: "users",
    label: "Users",
    icon: <Users size={18} style={{ marginRight: 8 }} />,
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: <BarChart2 size={18} style={{ marginRight: 8 }} />,
  },
];

const summaryCards = [
  {
    label: "Products",
    value: 8,
    icon: <ShoppingBag color="#ec4899" size={28} />,
    bg: "linear-gradient(90deg, #fdf2f8, #f3e8ff)",
  },
  {
    label: "Orders",
    value: 2,
    icon: <ClipboardList color="#9333ea" size={28} />,
    bg: "linear-gradient(90deg, #ede9fe, #fdf2f8)",
  },
  {
    label: "Users",
    value: 2,
    icon: <Users color="#c026d3" size={28} />,
    bg: "linear-gradient(90deg, #f3e8ff, #ede9fe)",
  },
];

const AdminPage = () => {
  const [tab, setTab] = useState("addProduct");
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [counts, setCounts] = useState({ products: 0, orders: 0, users: 0 });
  const [countsLoading, setCountsLoading] = useState(false);
  const [countsError, setCountsError] = useState(null);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch("http://localhost:5000/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAnalytics(data.analytics);
      } else {
        setAnalyticsError(data.message || "Failed to fetch analytics.");
      }
    } catch (err) {
      setAnalyticsError("Failed to fetch analytics.");
    }
    setAnalyticsLoading(false);
  };

  const fetchCounts = async () => {
    setCountsLoading(true);
    setCountsError(null);
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch("http://localhost:5000/api/admin/counts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCounts(data.counts);
      } else {
        setCountsError(data.message || "Failed to fetch counts.");
      }
    } catch (err) {
      setCountsError("Failed to fetch counts.");
    }
    setCountsLoading(false);
  };

  React.useEffect(() => {
    if (tab === "analytics") {
      fetchAnalytics();
    }
    fetchCounts();
  }, [tab]);

  return (
    <div className="admin-dashboard-bg">
      {/* Decorative Dots */}
      <div className="admin-decorative-dot admin-dot-1" />
      <div className="admin-decorative-dot admin-dot-2" />
      <div className="admin-decorative-dot admin-dot-3" />
      <div className="admin-decorative-dot admin-dot-4" />
      <div className="admin-dashboard-header">
        <img
          src={blissfulLogo}
          alt="Blissful Cakes Logo"
          className="admin-dashboard-logo"
        />
        <h1 className="admin-dashboard-title">Admin Dashboard</h1>
        <p className="admin-dashboard-subtitle">Manage your application</p>
        {/* Summary Bar */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            margin: "2rem 0 1.5rem 0",
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
          <div
            style={{
              background: "linear-gradient(90deg, #fdf2f8, #f3e8ff)",
              borderRadius: "1rem",
              boxShadow: "0 2px 8px rgba(236,72,153,0.08)",
              padding: "1.2rem 2.2rem",
              display: "flex",
              alignItems: "center",
              minWidth: 140,
              gap: 12,
            }}>
            <ShoppingBag color="#ec4899" size={28} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 22, color: "#c026d3" }}>
                {countsLoading ? "..." : counts.products}
              </div>
              <div style={{ fontWeight: 500, color: "#9333ea", fontSize: 14 }}>
                Products
              </div>
            </div>
          </div>
          <div
            style={{
              background: "linear-gradient(90deg, #ede9fe, #fdf2f8)",
              borderRadius: "1rem",
              boxShadow: "0 2px 8px rgba(236,72,153,0.08)",
              padding: "1.2rem 2.2rem",
              display: "flex",
              alignItems: "center",
              minWidth: 140,
              gap: 12,
            }}>
            <ClipboardList color="#9333ea" size={28} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 22, color: "#c026d3" }}>
                {countsLoading ? "..." : counts.orders}
              </div>
              <div style={{ fontWeight: 500, color: "#9333ea", fontSize: 14 }}>
                Orders
              </div>
            </div>
          </div>
          <div
            style={{
              background: "linear-gradient(90deg, #f3e8ff, #ede9fe)",
              borderRadius: "1rem",
              boxShadow: "0 2px 8px rgba(236,72,153,0.08)",
              padding: "1.2rem 2.2rem",
              display: "flex",
              alignItems: "center",
              minWidth: 140,
              gap: 12,
            }}>
            <Users color="#c026d3" size={28} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 22, color: "#c026d3" }}>
                {countsLoading ? "..." : counts.users}
              </div>
              <div style={{ fontWeight: 500, color: "#9333ea", fontSize: 14 }}>
                Users
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="admin-dashboard-tabs">
          {tabData.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                tab === t.key
                  ? "admin-dashboard-tab active"
                  : "admin-dashboard-tab"
              }>
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {/* Divider */}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          borderBottom: "2px solid #f3e8ff",
          marginBottom: 32,
        }}
      />
      <div className="admin-dashboard-card">
        {/* Section header with icon */}
        {tab === "addProduct" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 24,
              gap: 8,
            }}>
            <PlusCircle color="#ec4899" size={22} />
            <h2 style={{ margin: 0, color: "#c026d3" }}>Add Product</h2>
          </div>
        )}
        {tab === "products" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 24,
              gap: 8,
            }}>
            <ShoppingBag color="#ec4899" size={22} />
            <h2 style={{ margin: 0, color: "#ec4899" }}>Products</h2>
          </div>
        )}
        {tab === "orders" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 24,
              gap: 8,
            }}>
            <ClipboardList color="#9333ea" size={22} />
            <h2 style={{ margin: 0, color: "#9333ea" }}>Orders</h2>
          </div>
        )}
        {tab === "users" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 24,
              gap: 8,
            }}>
            <Users color="#c026d3" size={22} />
            <h2 style={{ margin: 0, color: "#c026d3" }}>Users</h2>
          </div>
        )}
        {tab === "analytics" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 24,
                gap: 8,
              }}>
              <BarChart2 color="#c026d3" size={22} />
              <h2 style={{ margin: 0, color: "#c026d3" }}>Analytics</h2>
            </div>
            {analyticsLoading ? (
              <div>Loading analytics...</div>
            ) : analyticsError ? (
              <div style={{ color: "red" }}>{analyticsError}</div>
            ) : (
              analytics && (
                <>
                  <div
                    style={{
                      display: "flex",
                      gap: "1.5rem",
                      marginBottom: 32,
                      flexWrap: "wrap",
                    }}>
                    <div
                      style={{
                        background: "linear-gradient(90deg, #fdf2f8, #f3e8ff)",
                        borderRadius: "1rem",
                        padding: "1.2rem 2.2rem",
                        minWidth: 180,
                      }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 22,
                          color: "#c026d3",
                        }}>
                        Rs {analytics.totalSales}
                      </div>
                      <div
                        style={{
                          fontWeight: 500,
                          color: "#9333ea",
                          fontSize: 14,
                        }}>
                        Total Sales
                      </div>
                    </div>
                    <div
                      style={{
                        background: "linear-gradient(90deg, #ede9fe, #fdf2f8)",
                        borderRadius: "1rem",
                        padding: "1.2rem 2.2rem",
                        minWidth: 180,
                      }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 22,
                          color: "#c026d3",
                        }}>
                        {analytics.newUsers}
                      </div>
                      <div
                        style={{
                          fontWeight: 500,
                          color: "#9333ea",
                          fontSize: 14,
                        }}>
                        New Users This Month
                      </div>
                    </div>
                    {["pending", "processing", "completed", "cancelled"].map(
                      (status) => (
                        <div
                          key={status}
                          style={{
                            background:
                              "linear-gradient(90deg, #f3e8ff, #ede9fe)",
                            borderRadius: "1rem",
                            padding: "1.2rem 2.2rem",
                            minWidth: 180,
                          }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 22,
                              color: "#c026d3",
                            }}>
                            {analytics.orderCounts[status] || 0}
                          </div>
                          <div
                            style={{
                              fontWeight: 500,
                              color: "#9333ea",
                              fontSize: 14,
                            }}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
                            Orders
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <h3 style={{ color: "#c026d3", marginBottom: 12 }}>
                      Most Popular Products
                    </h3>
                    {analytics.popularProducts.length === 0 ? (
                      <div>No data yet.</div>
                    ) : (
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Ordered</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.popularProducts.map((p) => (
                            <tr key={p.productId}>
                              <td className="admin-table-cell">{p.name}</td>
                              <td className="admin-table-cell">
                                {p.totalOrdered}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )
            )}
          </div>
        )}
        {/* Content */}
        {tab === "addProduct" && <AddProductForm />}
        {tab === "products" && <ProductsTable />}
        {tab === "orders" && <OrdersTable />}
        {tab === "users" && <UsersTable />}
      </div>
    </div>
  );
};

export default AdminPage;
