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
      <div style={styles.dataHeader}>
        <span style={styles.dataTitle}>SESSION ACTIVITY LOGS (KM)</span>
        <div style={styles.liveIndicator}>
          <div style={styles.pulseDot}></div>
          <span style={styles.dataStatus}>
            {user ? "LIVE FEED" : "OFFLINE"}
          </span>
        </div>
      </div>

      <div style={styles.chartBox}>
        {user && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {/* FIX: Use only ComposedChart here. Remove the nested AreaChart. */}
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
          <div style={styles.lockedChartOverlay}>LOCKED</div>
        )}
      </div>

      <div style={styles.metricRow}>
        <MetricItem label="AVG PACE" value={user ? stats.avgPace : "0.00"} />
        <MetricItem label="TOTAL KM" value={user ? stats.totalKm : "0.0"} />
        <MetricItem
          label="UPDATED"
          value={user ? lastUpdated : "XX-XX-XXXX"}
          isTime
        />
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
