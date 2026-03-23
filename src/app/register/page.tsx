"use client";

import React, { useState, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";

// --- Types & Interfaces ---
interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  mobile: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const VerifyOTP = ({
  email,
  onVerified,
}: {
  email: string;
  onVerified: () => void;
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("error");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Endpoint updated to match our logic
      await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });

      setToastMsg("IDENTITY VERIFIED: UPLINK STABLE.");
      setToastType("success");
      setShowToast(true);

      // Give the user time to read success before redirecting to login
      setTimeout(onVerified, 2000);
    } catch (error: any) {
      const msg = error.response?.data?.message || "INVALID CODE";
      setToastMsg(
        Array.isArray(msg) ? msg[0].toUpperCase() : msg.toUpperCase(),
      );
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.formWrapper}>
      <div style={styles.header}>
        <h1 style={styles.title}>VERIFY UPLINK</h1>
        <p style={styles.subtitle}>
          SECURE CODE DISPATCHED TO: {email.toUpperCase()}
        </p>
      </div>
      <form onSubmit={handleVerify}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>OTP CODE</label>
          <input
            type="text"
            placeholder="XXXXXX"
            style={styles.input}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.submitBtn,
            backgroundColor: "#d4ff00",
            color: "#000",
          }}
        >
          {loading ? "VERIFYING..." : "COMPLETE ACTIVATION →"}
        </button>
      </form>
      <Toast
        isVisible={showToast}
        message={toastMsg}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

// --- Main Component: RegisterForm ---
const RegisterForm = () => {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("error");

  const [formData, setFormData] = useState<RegisterRequest>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      /**
       * 🛰️ DATA SANITIZATION & DESTRUCTURING
       * We pull out only the fields defined in our RegisterDto.
       * This prevents "property confirmPassword should not exist" errors.
       */
      const { firstName, lastName, username, email, password, mobile } =
        formData;

      const sanitizedData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: email.trim().toLowerCase(), // Crucial for @IsEmail()
        password, // Never trim passwords
        mobile: mobile.trim(),
      };

      // Ensure we explicitly wait for the response
      const response = await axios.post(
        `${API_URL}/auth/register`,
        sanitizedData,
      );

      setToastMsg("RECRUIT SYNC: SUCCESS. OTP DISPATCHED.");
      setToastType("success");
      setShowToast(true);

      setTimeout(() => setIsVerifying(true), 1500);
    } catch (error: any) {
      /**
       * 🔍 DEEP ERROR LOGGING
       * If the backend returns a 400, the details are in error.response.data
       */
      const backendError = error.response?.data;
      console.error("REGISTRATION FAILURE DETAIL:", backendError);

      // Handle NestJS ValidationPipe array messages
      const rawMsg = backendError?.message || "REGISTRATION FAILED";
      const displayMsg = Array.isArray(rawMsg) ? rawMsg[0] : rawMsg;

      setToastMsg(displayMsg.toUpperCase());
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.container}>
      <div style={styles.formSide}>
        {isVerifying ? (
          <VerifyOTP
            email={formData.email}
            onVerified={() => router.push("/login")}
          />
        ) : (
          <div style={styles.formWrapper}>
            <div style={styles.header}>
              <h1 style={styles.title}>NEW RECRUIT</h1>
              <p style={styles.subtitle}>Join the PRX ecosystem.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={styles.row}>
                <div style={styles.inputContainer}>
                  <label style={styles.label}>FIRST NAME</label>
                  <input
                    name="firstName"
                    type="text"
                    style={styles.input}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Kyo"
                  />
                </div>
                <div style={styles.inputContainer}>
                  <label style={styles.label}>LAST NAME</label>
                  <input
                    name="lastName"
                    type="text"
                    style={styles.input}
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Evanz"
                  />
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.inputContainer}>
                  <label style={styles.label}>USER NAME</label>
                  <input
                    name="username"
                    type="text"
                    style={styles.input}
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="kyo.evanz"
                  />
                </div>
                <div style={styles.inputContainer}>
                  <label style={styles.label}>MOBILE</label>
                  <input
                    name="mobile"
                    type="text"
                    style={styles.input}
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    placeholder="09XX XXX XXXX"
                  />
                </div>
              </div>
              <div style={styles.inputContainer}>
                <label style={styles.label}>EMAIL ADDRESS</label>
                <input
                  name="email"
                  type="email"
                  style={styles.input}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="kyo.evanz@eprx.uv1"
                />
              </div>
              <div style={styles.inputContainer}>
                <label style={styles.label}>PASSWORD</label>
                <input
                  name="password"
                  type="password"
                  style={styles.input}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="******"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  backgroundColor: isHovered ? "#fff" : "transparent",
                  color: isHovered ? "#000" : "#fff",
                  borderColor: isHovered ? "#fff" : "#333",
                  opacity: loading ? 0.5 : 1,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {loading ? "PROCESSING..." : "CREATE ACCOUNT →"}
              </button>
            </form>
            <div style={styles.footer}>
              <p style={styles.footerText}>ALREADY REGISTERED?</p>
              <Link href="/login" style={styles.loginLink}>
                SIGN IN
              </Link>
            </div>
          </div>
        )}
      </div>

      <div style={styles.visualSide}>
        <div style={styles.overlay}>
          <div style={styles.verticalText}> PRX || REGISTER USER</div>
          <h2 style={styles.brandingTitle}>
            THE <br />
            <span style={{ color: "#d4ff00" }}>NEXT</span> GEN
          </h2>
        </div>
      </div>

      <Toast
        isVisible={showToast}
        message={toastMsg}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#0f0f0f",
    color: "#fff",
    paddingTop: "80px",
    boxSizing: "border-box",
  },
  formSide: {
    flex: "1",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "20px 40px",
  },
  formWrapper: { width: "100%", maxWidth: "380px" },
  header: { marginBottom: "25px" },
  title: { fontSize: "2.5rem", letterSpacing: "2px", margin: "5px 0" },
  subtitle: { color: "#666", fontSize: "0.75rem", lineHeight: "1.4" },
  row: { display: "flex", gap: "15px" },
  inputContainer: { marginBottom: "15px", flex: 1 },
  label: {
    display: "block",
    fontSize: "0.6rem",
    letterSpacing: "1px",
    color: "#444",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid #222",
    color: "#fff",
    padding: "8px 0",
    fontSize: "0.9rem",
    outline: "none",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    border: "1px solid",
    fontSize: "0.7rem",
    letterSpacing: "3px",
    cursor: "pointer",
    transition: "0.4s ease",
    marginTop: "10px",
  },
  visualSide: {
    flex: "1.2",
    backgroundImage: 'url("/assets/images/register.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    minHeight: "100vh",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "40px",
    textAlign: "right",
  },
  verticalText: {
    transform: "rotate(90deg)",
    transformOrigin: "right top",
    fontSize: "0.6rem",
    letterSpacing: "5px",
    color: "#ccc",
    marginTop: "200px",
  },
  brandingTitle: {
    fontSize: "4rem",
    lineHeight: "0.9",
    letterSpacing: "2px",
    marginBottom: "80px",
  },
  footer: {
    marginTop: "0px",
    borderTop: "1px solid #1a1a1a",
    paddingTop: "10px",
  },
  footerText: { fontSize: "0.6rem", color: "#444", marginBottom: "5px" },
  loginLink: { color: "#d4ff00", fontSize: "0.7rem", textDecoration: "none" },
};

export default function Register() {
  return (
    <Suspense
      fallback={
        <div style={{ backgroundColor: "#0f0f0f", height: "100vh" }}>
          LOADING_INTERFACE...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
