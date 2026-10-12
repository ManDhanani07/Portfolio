import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
} from "../api";
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
  Send,
  ArrowLeft,
  Key,
} from "lucide-react";

function Auth({ initialMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Check query params for reset token (e.g. /reset-password?token=...&email=...)
  const queryParams = new URLSearchParams(location.search);
  const tokenFromUrl = queryParams.get("token") || "";
  const emailFromUrl = queryParams.get("email") || "";

  // Mode: "login" | "register" | "forgot" | "reset"
  const determineInitialMode = () => {
    if (tokenFromUrl || location.pathname.includes("reset-password")) {
      return "reset";
    }
    if (initialMode === "forgot" || location.pathname.includes("forgot-password")) {
      return "forgot";
    }
    if (initialMode === "register" || location.pathname.includes("register")) {
      return "register";
    }
    return "login";
  };

  const [mode, setMode] = useState(determineInitialMode);
  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState(tokenFromUrl);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      setMode("reset");
    }
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [tokenFromUrl, emailFromUrl]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
  };

  // Password validation checks
  const isMinLength = password.length >= 6;
  const isMatched = (mode === "register" || mode === "reset") && password && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Client-side validation
    if (!email.trim()) {
      setError("Please provide a valid email address.");
      return;
    }

    if (mode === "forgot") {
      setLoading(true);
      try {
        const res = await forgotPassword(email.trim());
        setSuccessMessage(
          res.message || "Password reset instructions have been sent to your email with Nodemailer."
        );
      } catch (err) {
        setError(err.message || "Failed to send reset email. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === "reset") {
      if (!resetToken.trim()) {
        setError("Please enter the password reset token from your email.");
        return;
      }
      if (!password || password.length < 6) {
        setError("New password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match. Please verify and try again.");
        return;
      }

      setLoading(true);
      try {
        const res = await resetPassword({
          email: email.trim(),
          token: resetToken.trim(),
          newPassword: password,
        });
        setSuccessMessage(res.message || "Password reset successful! Redirecting to login...");
        setTimeout(() => {
          switchMode("login");
          setPassword("");
          setConfirmPassword("");
        }, 1500);
      } catch (err) {
        setError(err.message || "Failed to reset password. Token may be invalid or expired.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Login or Register flow
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match. Please verify and try again.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await loginUser({ email: email.trim(), password });
        setSuccessMessage("Authentication successful! Redirecting to Task Workspace...");
        setTimeout(() => {
          navigate("/task");
        }, 600);
      } else {
        await registerUser({ email: email.trim(), password });
        setSuccessMessage("Account created successfully! Logging you in...");
        await loginUser({ email: email.trim(), password });
        setTimeout(() => {
          navigate("/task");
        }, 600);
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
          font-family: 'Outfit', sans-serif;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          background: var(--bg-secondary, #111827);
          border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
          border-radius: 20px;
          padding: 36px 32px;
          box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.5);
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .auth-card:hover {
          box-shadow: 0 25px 50px -10px rgba(99, 102, 241, 0.2);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .auth-badge-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          margin: 0 auto 14px;
          box-shadow: 0 6px 18px rgba(99, 102, 241, 0.35);
        }

        .auth-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-main, #ffffff);
          margin-bottom: 6px;
        }

        .auth-subtitle {
          font-size: 13px;
          color: var(--text-muted, #94a3b8);
          line-height: 1.5;
        }

        .auth-tab-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 24px;
          gap: 4px;
        }

        .tab-switch-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-muted, #94a3b8);
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-switch-btn.active {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .auth-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .auth-input-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-main, #ffffff);
        }

        .auth-input-field {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted, #94a3b8);
          pointer-events: none;
        }

        .field-input {
          width: 100%;
          padding: 10px 40px 10px 38px;
          border-radius: 10px;
          border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
          background: rgba(0, 0, 0, 0.2);
          color: var(--text-main, #ffffff);
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .field-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        .toggle-password-btn {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          color: var(--text-muted, #94a3b8);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle-password-btn:hover {
          color: var(--text-main, #ffffff);
        }

        .auth-extra-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
        }

        .remember-checkbox {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted, #94a3b8);
          cursor: pointer;
        }

        .auth-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(99, 102, 241, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          margin-top: 6px;
        }

        .auth-action-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.45);
        }

        .auth-action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 12px;
          line-height: 1.4;
          margin-bottom: 16px;
        }

        .auth-alert.error {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.28);
          color: #f87171;
        }

        .auth-alert.success {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.28);
          color: #34d399;
        }

        .auth-security-footer {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--border, rgba(255, 255, 255, 0.08));
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 11px;
          color: var(--text-muted, #64748b);
        }

        .security-badge-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rule-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--text-muted, #94a3b8);
        }

        .rule-item.valid {
          color: #10b981;
        }

        .rule-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--text-muted, #64748b);
        }

        .back-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #818cf8;
          font-size: 12px;
          font-weight: 700;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'Outfit', sans-serif;
        }

        .back-link-btn:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-badge-icon">
              {mode === "forgot" ? (
                <Mail size={24} />
              ) : mode === "reset" ? (
                <KeyRound size={24} />
              ) : mode === "login" ? (
                <LogIn size={24} />
              ) : (
                <UserPlus size={24} />
              )}
            </div>

            <h1 className="auth-title">
              {mode === "login"
                ? "Welcome Back"
                : mode === "register"
                ? "Create Account"
                : mode === "forgot"
                ? "Reset Password"
                : "New Password"}
            </h1>

            <p className="auth-subtitle">
              {mode === "login"
                ? "Sign in with your email & password to access your task workspace."
                : mode === "register"
                ? "Register a new secure account with JWT & bcrypt protection."
                : mode === "forgot"
                ? "Enter your email to receive a password reset link via Nodemailer."
                : "Choose a new password to restore access to your account."}
            </p>
          </div>

          {/* Mode Switcher Tabs for Login / Register */}
          {(mode === "login" || mode === "register") && (
            <div className="auth-tab-switch">
              <button
                type="button"
                className={`tab-switch-btn ${mode === "login" ? "active" : ""}`}
                onClick={() => switchMode("login")}
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className={`tab-switch-btn ${mode === "register" ? "active" : ""}`}
                onClick={() => switchMode("register")}
              >
                <UserPlus size={14} />
                <span>Register</span>
              </button>
            </div>
          )}

          {/* Alerts */}
          {error && (
            <div className="auth-alert error">
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert success">
              <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field */}
            <div className="auth-form-group">
              <label htmlFor="auth-email" className="auth-input-label">
                <span>Email Address</span>
              </label>
              <div className="auth-input-field">
                <Mail size={16} className="field-icon" />
                <input
                  id="auth-email"
                  type="email"
                  className="field-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Reset Token Field (Only in Reset Mode) */}
            {mode === "reset" && (
              <div className="auth-form-group">
                <label htmlFor="auth-token" className="auth-input-label">
                  <span>Reset Token</span>
                </label>
                <div className="auth-input-field">
                  <Key size={16} className="field-icon" />
                  <input
                    id="auth-token"
                    type="text"
                    className="field-input"
                    placeholder="Enter token from reset email"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Field (Login, Register, and Reset Modes) */}
            {mode !== "forgot" && (
              <div className="auth-form-group">
                <div className="auth-input-label">
                  <span>{mode === "reset" ? "New Password" : "Password"}</span>
                </div>
                <div className="auth-input-field">
                  <Lock size={16} className="field-icon" />
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    className="field-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
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
                {(mode === "register" || mode === "reset") && (
                  <div style={{ marginTop: 4 }}>
                    <div className={`rule-item ${isMinLength ? "valid" : ""}`}>
                      {isMinLength ? <Check size={12} /> : <span className="rule-dot" />}
                      <span>At least 6 characters</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confirm Password Field (Register and Reset Modes) */}
            {(mode === "register" || mode === "reset") && (
              <div className="auth-form-group">
                <div className="auth-input-label">
                  <span>Confirm Password</span>
                </div>
                <div className="auth-input-field">
                  <KeyRound size={16} className="field-icon" />
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
                  <div style={{ marginTop: 4 }}>
                    <div className={`rule-item ${isMatched ? "valid" : ""}`}>
                      {isMatched ? <Check size={12} /> : <span className="rule-dot" />}
                      <span>{isMatched ? "Passwords match" : "Passwords do not match"}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Extras Row in Login Mode */}
            {mode === "login" && (
              <div className="auth-extra-row">
                <label className="remember-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="back-link-btn"
                  onClick={() => switchMode("forgot")}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Forgot / Reset Navigation Links */}
            {mode === "forgot" && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                <button
                  type="button"
                  className="back-link-btn"
                  onClick={() => switchMode("login")}
                >
                  <ArrowLeft size={13} />
                  <span>Back to Sign In</span>
                </button>
                <button
                  type="button"
                  className="back-link-btn"
                  onClick={() => switchMode("reset")}
                >
                  <span>Have a reset token?</span>
                </button>
              </div>
            )}

            {mode === "reset" && (
              <div style={{ fontSize: "12px" }}>
                <button
                  type="button"
                  className="back-link-btn"
                  onClick={() => switchMode("login")}
                >
                  <ArrowLeft size={13} />
                  <span>Back to Sign In</span>
                </button>
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
                  <span>Processing...</span>
                </>
              ) : mode === "login" ? (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              ) : mode === "register" ? (
                <>
                  <span>Create Account</span>
                  <UserPlus size={16} />
                </>
              ) : mode === "forgot" ? (
                <>
                  <span>Send Reset Email</span>
                  <Send size={15} />
                </>
              ) : (
                <>
                  <span>Update Password</span>
                  <KeyRound size={16} />
                </>
              )}
            </button>
          </form>

          {/* Security Footnote */}
          <div className="auth-security-footer">
            <div className="security-badge-item">
              <ShieldCheck size={13} style={{ color: "#10b981" }} />
              <span>JWT & bcryptjs</span>
            </div>
            <span>•</span>
            <div className="security-badge-item">
              <span>Nodemailer Reset</span>
            </div>
            <span>•</span>
            <div className="security-badge-item">
              <span>RBAC Admin</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;
