import React, { useState } from "react";
import { X } from "lucide-react";
import blissfulLogo from "../assets/blissful-logo.jpg";
import { Button } from "../components/ui/button";
import SignInForm from "../components/ui/SignInForm";
import SignUpForm from "../components/ui/SignUpForm";
import ForgotPasswordForm from "../components/ui/ForgotPasswordForm";
import AdminLoginForm from "../components/ui/AdminLoginForm";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ setShowAuthModal, setUser, Cookies }) => {
  const [authMode, setAuthMode] = useState("signIn");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [adminFormData, setAdminFormData] = useState({
    email: "",
    password: "",
  });
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);
  const [authMessageType, setAuthMessageType] = useState(null); 
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleAdminInputChange = (e) => {
    setAdminFormData({ ...adminFormData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    console.log(formData);

    e.preventDefault();
    setAuthMessage(null);
    setAuthMessageType(null);
    try {
      const endpoint =
        authMode === "signUp"
          ? "http://localhost:5000/api/auth/register"
          : "http://localhost:5000/api/auth/login";
      const payload =
        authMode === "signUp"
          ? {
              username: formData.username,
              email: formData.email,
              password: formData.password,
            }
          : { email: formData.email, password: formData.password };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.data || !data.data.token) {
        setAuthMessage(data.message || "Authentication failed");
        setAuthMessageType("error");
        return;
      }
      // Prevent admin login from user form
      if (data.data.user.role === "admin") {
        setAuthMessage("Admins must use the Admin Login tab.");
        setAuthMessageType("error");
        return;
      }
      Cookies.set("auth_token", data.data.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(data.data.user), { expires: 7 });
      setUser(data.data.user);
      // Show welcome message for user login only
      if (authMode === "signIn") {
        setAuthMessage(
          `Hello ${
            data.data.user.username || data.data.user.email
          } welcome to Blissful Cakes`
        );
      } else {
        setAuthMessage(
          authMode === "signUp"
            ? "Registration successful! Welcome!"
            : "Login successful!"
        );
      }
      setAuthMessageType("success");
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthMessage(null);
        setAuthMessageType(null);
      }, 1200);
      setFormData({ username: "", email: "", password: "" });
    } catch (err) {
      console.log(err);

      setAuthMessage("An error occurred. Please try again.");
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthMessage(null);
    setAuthMessageType(null);
    // Fallback to API login for other credentials
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminFormData),
      });
      const data = await res.json();
      if (!res.ok || !data.data || !data.data.token) {
        setAuthMessage(data.message || "Admin authentication failed");
        setAuthMessageType("error");
        return;
      }
      if (data.data.user.role !== "admin") {
        setAuthMessage("You are not authorized as admin.");
        setAuthMessageType("error");
        return;
      }
      Cookies.set("auth_token", data.data.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(data.data.user), { expires: 7 });
      localStorage.setItem("admin_token", data.data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.data.user));
      setUser(data.data.user);
      setAuthMessage("Admin login successful!");
      setAuthMessageType("success");
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthMessage(null);
        setAuthMessageType(null);
        navigate("/admin");
      }, 1200);
      setAdminFormData({ email: "", password: "" });
    } catch (err) {
      setAuthMessage(`${err}`);
      setAuthMessageType("error");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthMessage(null);
    setAuthMessageType(null);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });
      setForgotPasswordSent(true);
      setAuthMessage("If your email exists, a reset link has been sent.");
      setAuthMessageType("success");
    } catch (err) {
      setForgotPasswordSent(true);
      setAuthMessage(err);
      setAuthMessageType("error");
    }
  };

  const toggleAuthMode = (mode) => {
    setAuthMode(mode);
    setFormData({ username: "", email: "", password: "" });
    setAdminFormData({ email: "", password: "" });
    setShowPassword(false);
    setForgotPasswordMode(false);
    setForgotPasswordSent(false);
    setForgotPasswordEmail("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button onClick={() => setShowAuthModal(false)} className="modal-close">
          <X />
        </button>
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-icon">
              <img
                src={blissfulLogo}
                alt="Blissful Cakes Logo"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow: "0 2px 8px rgba(236,72,153,0.10)",
                }}
              />
            </div>
            <h2 className="modal-title">Welcome to Blissful Cake</h2>
            <p className="modal-subtitle">Your sweet journey begins here</p>
          </div>
          <div className="auth-toggle">
            <button
              onClick={() => toggleAuthMode("signIn")}
              className={`auth-toggle-button ${
                authMode === "signIn" ? "active" : "inactive"
              }`}>
              Sign In
            </button>
            <button
              onClick={() => toggleAuthMode("signUp")}
              className={`auth-toggle-button ${
                authMode === "signUp" ? "active" : "inactive"
              }`}>
              Sign Up
            </button>
            <button
              onClick={() => toggleAuthMode("admin")}
              className={`auth-toggle-button ${
                authMode === "admin" ? "active" : "inactive"
              }`}>
              Admin Login
            </button>
          </div>
          {forgotPasswordMode ? (
            <div className="form-card">
              <ForgotPasswordForm
                email={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                onSubmit={handleForgotPasswordSubmit}
                onBack={() => {
                  setForgotPasswordMode(false);
                  setForgotPasswordSent(false);
                  setForgotPasswordEmail("");
                }}
                sent={forgotPasswordSent}
              />
            </div>
          ) : authMode === "signIn" ? (
            <div className="form-card">
              <SignInForm
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleAuthSubmit}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onForgotPassword={() => setForgotPasswordMode(true)}
              />
            </div>
          ) : authMode === "signUp" ? (
            <div className="form-card">
              <SignUpForm
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleAuthSubmit}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            </div>
          ) : (
            <div className="form-card">
              <AdminLoginForm
                formData={adminFormData}
                onChange={handleAdminInputChange}
                onSubmit={handleAdminLogin}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            </div>
          )}
          {authMessage && (
            <div
              style={{
                color: authMessageType === "success" ? "#16a34a" : "#dc2626",
                background:
                  authMessageType === "success" ? "#f0fdf4" : "#fef2f2",
                border: `1.5px solid ${
                  authMessageType === "success" ? "#bbf7d0" : "#fecaca"
                }`,
                borderRadius: 8,
                padding: "0.7rem 1rem",
                marginBottom: 12,
                textAlign: "center",
                fontWeight: 500,
              }}>
              {authMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
