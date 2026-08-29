import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginUser, registerUser } from "../api";
import {
  Lock,
  Mail,
  UserPlus,
  LogIn,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  Shield,
  Loader2,
} from "lucide-react";

function Auth({ initialMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial mode from path or prop
  const isRegisterInitial =
    initialMode === "register" ||
    location.pathname.includes("register");

  const [isLogin, setIsLogin] = useState(!isRegisterInitial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const switchMode = (mode) => {
    setIsLogin(mode === "login");
    setError(null);
    setSuccessMessage(null);
  };

  // Password validation checks for register
  const isMinLength = password.length >= 6;
  const isMatched = !isLogin && password && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Client-side validation
    if (!email.trim()) {
      setError("Please provide a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match. Please verify and try again.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Handle Login
        await loginUser({ email, password });
        setSuccessMessage("Authentication successful! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/task");
        }, 700);
      } else {
        // Handle Registration
        await registerUser({ email, password });
        setSuccessMessage("Account created successfully! Logging you in...");
        // Auto login right after registration
        await loginUser({ email, password });
        setTimeout(() => {
          navigate("/task");
        }, 700);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .auth-wrapper {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
          background:
            radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.12), transparent 45%),
            radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.10), transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.06), transparent 50%),
            var(--bg-primary, #090d16);
          position: relative;
        }

        .auth-card-wrapper {
          width: 100%;
          max-width: 460px;
          position: relative;
          z-index: 2;
        }

        .auth-card {
          background: var(--bg-secondary, #111726);
          border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
          border-radius: 24px;
          padding: 40px 36px;
          box-shadow: 
            0 24px 60px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
        }

        .auth-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #06b6d4, #8b5cf6, #3b82f6);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .auth-brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.4px;
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary, #818cf8);
          border: 1px solid rgba(99, 102, 241, 0.2);
          margin-bottom: 16px;
        }

        .auth-title {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-main, #f8fafc);
          margin: 0 0 8px;
          letter-spacing: -0.6px;
        }

        .auth-subtitle {
          font-size: 14px;
          color: var(--text-muted, #94a3b8);
          margin: 0;
          line-height: 1.5;
        }

        /* Mode Switcher Tabs */
        .auth-nav-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          background: var(--bg-primary, rgba(0, 0, 0, 0.35));
          padding: 4px;
          border-radius: 14px;
          margin-bottom: 24px;
          border: 1px solid var(--border, rgba(255, 255, 255, 0.06));
        }

        .auth-nav-tab {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: var(--text-muted, #94a3b8);
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .auth-nav-tab.active {
          background: var(--bg-secondary, #1e293b);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .auth-nav-tab:hover:not(.active) {
          color: var(--text-main, #e2e8f0);
        }

        /* Alert Callouts */
        .auth-alert-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          margin-bottom: 22px;
          line-height: 1.45;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #f87171;
        }

        .alert-success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #34d399;
        }

        /* Input Controls */
        .auth-input-group {
          margin-bottom: 20px;
        }

        .auth-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 7px;
        }

        .auth-input-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-main, #e2e8f0);
        }

        .auth-input-field {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted, #94a3b8);
          pointer-events: none;
        }

        .field-input {
          width: 100%;
          padding: 12px 42px 12px 42px;
          background: var(--bg-primary, #0f172a);
          border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
          border-radius: 12px;
          color: var(--text-main, #ffffff);
          font-size: 14px;
          transition: all 0.2s ease;
          outline: none;
          box-sizing: border-box;
        }

        .field-input:focus {
          border-color: var(--primary, #6366f1);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          background: rgba(15, 23, 42, 0.95);
        }

        .toggle-password-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: var(--text-muted, #94a3b8);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .toggle-password-btn:hover {
          color: var(--text-main, #ffffff);
        }

        /* Password Checklist on Register */
        .password-rules {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 8px;
          padding: 10px 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          border: 1px solid var(--border, rgba(255, 255, 255, 0.05));
        }

        .rule-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-muted, #94a3b8);
          transition: color 0.2s ease;
        }

        .rule-item.valid {
          color: #10b981;
        }

        .rule-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        /* Form Extras (Remember me & Links) */
        .auth-extra-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 22px;
          color: var(--text-muted, #94a3b8);
        }

        .remember-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .remember-checkbox input {
          accent-color: var(--primary, #6366f1);
          cursor: pointer;
        }

        /* Main Submit Button */
        .auth-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 20px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
        }

        .auth-action-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.45);
        }

        .auth-action-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Trust & Security Footnote */
        .auth-security-footer {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid var(--border, rgba(255, 255, 255, 0.06));
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          font-size: 11.5px;
          color: var(--text-muted, #64748b);
        }

        .security-badge-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
      `}</style>

      <div className="auth-wrapper">
        <div className="auth-card-wrapper">
          <div className="auth-card">
            {/* Header Section */}
            <div className="auth-header">
              <div className="auth-brand-badge">
                <Shield size={13} />
                <span>Secure Authentication Portal</span>
              </div>
              <h1 className="auth-title">
                {isLogin ? "Sign in to account" : "Create an account"}
              </h1>
              <p className="auth-subtitle">
                {isLogin
                  ? "Access your protected workspace and manage tasks"
                  : "Register with your credentials to get your JWT token"}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="auth-nav-tabs">
              <button
                type="button"
                className={`auth-nav-tab ${isLogin ? "active" : ""}`}
                onClick={() => switchMode("login")}
              >
                <LogIn size={15} /> Sign In
              </button>
              <button
                type="button"
                className={`auth-nav-tab ${!isLogin ? "active" : ""}`}
                onClick={() => switchMode("register")}
              >
                <UserPlus size={15} /> Sign Up
              </button>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="auth-alert-box alert-error">
                <AlertCircle size={17} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>{error}</div>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="auth-alert-box alert-success">
                <CheckCircle2 size={17} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>{successMessage}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="auth-input-group">
                <div className="auth-label-row">
                  <label className="auth-input-label" htmlFor="user-email">
                    Email Address
                  </label>
                </div>
                <div className="auth-input-field">
                  <Mail size={17} className="field-icon" />
                  <input
                    id="user-email"
                    type="email"
                    className="field-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="auth-input-group">
                <div className="auth-label-row">
                  <label className="auth-input-label" htmlFor="user-password">
                    Password
                  </label>
                </div>
                <div className="auth-input-field">
                  <Lock size={17} className="field-icon" />
                  <input
                    id="user-password"
                    type={showPassword ? "text" : "password"}
                    className="field-input"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {!isLogin && (
                  <div className="password-rules">
                    <div className={`rule-item ${isMinLength ? "valid" : ""}`}>
                      {isMinLength ? <Check size={12} /> : <span className="rule-dot" />}
                      <span>At least 6 characters</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              {!isLogin && (
                <div className="auth-input-group">
                  <div className="auth-label-row">
                    <label className="auth-input-label" htmlFor="confirm-password">
                      Confirm Password
                    </label>
                  </div>
                  <div className="auth-input-field">
                    <KeyRound size={17} className="field-icon" />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="field-input"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className="password-rules" style={{ marginTop: 6 }}>
                      <div className={`rule-item ${isMatched ? "valid" : ""}`}>
                        {isMatched ? <Check size={12} /> : <span className="rule-dot" />}
                        <span>{isMatched ? "Passwords match" : "Passwords do not match"}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Extras Row (Remember Me) */}
              {isLogin && (
                <div className="auth-extra-row">
                  <label className="remember-checkbox">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <span style={{ fontSize: "12px", color: "var(--primary, #818cf8)", cursor: "pointer" }}>
                    Forgot password?
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="auth-action-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                    <span>Authenticating...</span>
                  </>
                ) : isLogin ? (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <UserPlus size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Security Footnote */}
            <div className="auth-security-footer">
              <div className="security-badge-item">
                <ShieldCheck size={13} style={{ color: "#10b981" }} />
                <span>JWT Encrypted</span>
              </div>
              <span>•</span>
              <div className="security-badge-item">
                <span>bcryptjs Hashed</span>
              </div>
              <span>•</span>
              <div className="security-badge-item">
                <span>Protected Middleware</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;
