import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { homeStyles as styles } from "../components/styles";
import Link from "next/link"; // FIX: Import actual Link component, not the icon

export default function ActivityChart({
  user,
  data,
  stats,
  isMobile,
  lastUpdated,
}: any) {
  return (
    <motion.div
      style={{ ...styles.dataContainer, maxWidth: isMobile ? "100%" : "450px" }}
    >
      <div style={styles.liveIndicator}>
        <div
          style={
            user
              ? {
                  ...styles.pulseDot,
                  marginTop: "4px",
                  marginBottom: "10px",
                }
              : {
                  ...styles.pulseDot,
                  backgroundColor: "#444",
                  boxShadow: "none",
                  marginTop: "4px",
                  marginBottom: "10px",
                }
          }
        ></div>
        <span
          style={{
            ...styles.dataTitle,
            marginTop: "4px",
            marginBottom: "10px",
          }}
        >
          SESSION ACTIVITY LOGS (KM)
        </span>
        <span
          style={{
            ...styles.dataStatus,
            marginTop: "4px",
            marginBottom: "10px",
          }}
        >
          {user ? "LIVE FEED" : "STATUS: OFFLINE"}
        </span>
      </div>

      {/* --- CHART VISUALIZER --- */}
      <div style={styles.chartBox}>
        {user && data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4ff00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d4ff00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1a1a1a"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="#444"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000",
                  border: "1px solid #d4ff00",
                  fontSize: "0.8rem",
                }}
              />
              <Area
                type="basis"
                dataKey="distance"
                fill="url(#glow)"
                stroke="none"
                isAnimationActive={true}
              />
              <Line
                type="basis"
                dataKey="distance"
                stroke="#d4ff00"
                strokeWidth={3}
                dot={false}
                isAnimationActive={true}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div style={styles.lockedChartOverlay}>
            <span style={{ letterSpacing: "8px", opacity: 0.5 }}>LOCKED</span>
          </div>
        )}
      </div>

      {/* --- METRIC DATA FOOTER --- */}
      <div style={styles.metricRow}>
        {/* 🔥 UPDATED: Changed from AVG PACE to TOTAL HR tracking */}
        <MetricItem
          label="TOTAL HR"
          value={user ? stats.totalHr : "0.0 HR/S"}
        />
        <MetricItem
          label="TOTAL KM"
          value={user ? stats.totalKm : "0.0 KM/S"}
        />
        <MetricItem
          label="UPDATED"
          value={user ? lastUpdated : "XX-XX-XXXX"}
          isTime
        />
      </div>

      {/* --- HEADER SECTION --- */}
      <div style={styles.dataHeader}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* REARRANGED REMINDER: System message style */}
          {!user && (
            <span
              style={{
                fontSize: "0.6rem",
                color: "#d4ff00",
                marginTop: "4px",
                fontFamily: "monospace",
                opacity: 0.8,
              }}
            >
              RESTRICTED ACCESS:{" "}
              <Link
                href="/login"
                style={{ color: "#fff", textDecoration: "underline" }}
              >
                LOGIN
              </Link>{" "}
              OR{" "}
              <Link
                href="/register"
                style={{ color: "#fff", textDecoration: "underline" }}
              >
                REGISTER
              </Link>{" "}
              TO SEE YOUR PROGRESS DATA
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const MetricItem = ({ label, value, isTime }: any) => (
  <div style={styles.metricItem}>
    <span style={styles.metricLabel}>{label}</span>
    <span style={isTime ? styles.timestampValue : styles.metricValue}>
      {value}
    </span>
  </div>
);
