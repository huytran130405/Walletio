import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import CircularProgress from "../../components/common/CircularProgress";
import { colors }     from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing }    from "../../theme/spacing";

const FILTERS = ["Tháng này", "Tháng trước", "3 tháng"];
const CAT_COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#EC4899", "#A855F7", "#14B8A6", "#EF4444", "#F97316"];

export default function Statistics() {
  const [filter, setFilter] = useState("Tháng này");
  const transactions = useSelector((s) => s.transactions.transactions);

  const now = new Date();

  // Lấy period range theo filter
  const { startDate, endDate, label } = useMemo(() => {
    const d = new Date(now);
    if (filter === "Tháng này") {
      return {
        startDate: new Date(d.getFullYear(), d.getMonth(), 1),
        endDate:   new Date(d.getFullYear(), d.getMonth() + 1, 0),
        label:     `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`,
      };
    } else if (filter === "Tháng trước") {
      const prev = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      return {
        startDate: prev,
        endDate:   new Date(d.getFullYear(), d.getMonth(), 0),
        label:     `Tháng ${prev.getMonth() + 1}/${prev.getFullYear()}`,
      };
    } else {
      const threeMonthAgo = new Date(d.getFullYear(), d.getMonth() - 2, 1);
      return {
        startDate: threeMonthAgo,
        endDate:   new Date(d.getFullYear(), d.getMonth() + 1, 0),
        label:     "3 tháng gần đây",
      };
    }
  }, [filter]);

  // Lọc transactions theo period
  const periodTxs = useMemo(() => {
    return transactions.filter((t) => {
      const [d, m, y] = t.date.split("/");
      const txDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      return txDate >= startDate && txDate <= endDate;
    });
  }, [transactions, startDate, endDate]);

  const totalChi = periodTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalThu = periodTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

  // % thay đổi so với period trước
  const prevStart = new Date(startDate);
  const prevEnd   = new Date(endDate);
  const periodLen = endDate - startDate;
  prevStart.setTime(prevStart.getTime() - periodLen - 86400000);
  prevEnd.setTime(startDate.getTime() - 86400000);

  const prevTxs = transactions.filter((t) => {
    const [d, m, y] = t.date.split("/");
    const txDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return txDate >= prevStart && txDate <= prevEnd;
  });
  const prevChi = prevTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const prevThu = prevTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

  const chiChange = prevChi > 0 ? ((totalChi - prevChi) / prevChi * 100).toFixed(0) : null;
  const thuChange = prevThu > 0 ? ((totalThu - prevThu) / prevThu * 100).toFixed(0) : null;

  // Group by category (expense)
  const catMap = {};
  periodTxs.filter((t) => t.type === "expense").forEach((t) => {
    if (!catMap[t.category]) catMap[t.category] = 0;
    catMap[t.category] += t.amount;
  });
  const categories = Object.entries(catMap)
    .map(([name, amount], i) => ({
      name,
      amount,
      pct: totalChi > 0 ? Math.round(amount / totalChi * 100) : 0,
      color: CAT_COLORS[i % CAT_COLORS.length],
    }))
    .sort((a, b) => b.amount - a.amount);

  const chartProgress = totalThu > 0 ? Math.min(totalChi / totalThu, 1) : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}><Text style={styles.avatarText}>📈</Text></View>
          <Text style={styles.name}>Thống kê</Text>
        </View>

        {/* Title + period label */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Phân tích chi tiêu</Text>
          <View style={styles.periodBadge}>
            <Text style={styles.periodText}>{label}</Text>
          </View>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderLeftColor: colors.expense, borderLeftWidth: 3 }]}>
            <Text style={styles.summaryLabel}>Tổng chi</Text>
            <Text style={[styles.summaryValue, { color: colors.expense }]}>
              {(totalChi / 1000000).toFixed(2)}M
            </Text>
            {chiChange !== null && (
              <Text style={styles.summaryChange}>
                {Number(chiChange) >= 0 ? `▲ ${chiChange}%` : `▼ ${Math.abs(chiChange)}%`} so với trước
              </Text>
            )}
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: colors.income, borderLeftWidth: 3 }]}>
            <Text style={styles.summaryLabel}>Tổng thu</Text>
            <Text style={[styles.summaryValue, { color: colors.income }]}>
              {(totalThu / 1000000).toFixed(2)}M
            </Text>
            {thuChange !== null && (
              <Text style={styles.summaryChange}>
                {Number(thuChange) >= 0 ? `▲ ${thuChange}%` : `▼ ${Math.abs(thuChange)}%`} so với trước
              </Text>
            )}
          </View>
        </View>

        {/* Cơ cấu chi tiêu (circular) */}
        {totalChi > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Cơ cấu chi tiêu</Text>
            <View style={styles.circleWrap}>
              <CircularProgress
                size={140}
                strokeWidth={16}
                progress={chartProgress}
                centerLabel={label}
                centerValue={`${(totalChi / 1000000).toFixed(2)}M`}
                color={colors.primary}
                trackColor="#DCFCE7"
              />
            </View>
          </View>
        )}

        {/* Chi tiết danh mục */}
        {categories.length > 0 ? (
          <View style={[styles.card, { marginBottom: spacing.xxl ?? 40 }]}>
            <Text style={styles.cardTitle}>Chi tiết danh mục</Text>
            {categories.map((cat, i) => (
              <View key={i} style={styles.catRow}>
                <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                <Text style={styles.catName}>{cat.name}</Text>
                <View style={styles.catBarWrap}>
                  <View style={[styles.catBar, { width: `${cat.pct}%`, backgroundColor: cat.color }]} />
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.catAmt}>{(cat.amount / 1000).toLocaleString("vi-VN")}₫</Text>
                  <Text style={styles.catPct}>{cat.pct}%</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyText}>Không có dữ liệu trong {label.toLowerCase()}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: "#F4F6F9" },
  header:           { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.base, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  avatar:           { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", marginRight: spacing.sm },
  avatarText:       { fontSize: 20 },
  name:             { flex: 1, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semiBold, color: colors.textPrimary },
  titleRow:         { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.base, marginBottom: spacing.sm },
  title:            { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  periodBadge:      { backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: spacing.sm, paddingVertical: 4, borderWidth: 1, borderColor: colors.border },
  periodText:       { fontSize: typography.fontSize.sm, color: colors.textPrimary },
  filterRow:        { flexDirection: "row", paddingHorizontal: spacing.base, gap: spacing.sm, marginBottom: spacing.md },
  filterBtn:        { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border },
  filterActive:     { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText:       { fontSize: typography.fontSize.sm, color: colors.textSecondary, fontWeight: typography.fontWeight.medium },
  filterTextActive: { color: "#fff" },
  summaryRow:       { flexDirection: "row", paddingHorizontal: spacing.base, gap: spacing.sm, marginBottom: spacing.md },
  summaryCard:      { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: spacing.md },
  summaryLabel:     { fontSize: typography.fontSize.sm, color: colors.textSecondary },
  summaryValue:     { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, marginTop: 4 },
  summaryChange:    { fontSize: 10, color: colors.textSecondary, marginTop: 4 },
  card:             { marginHorizontal: spacing.base, backgroundColor: "#fff", borderRadius: 16, padding: spacing.base, marginBottom: spacing.md },
  cardTitle:        { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semiBold, color: colors.textPrimary, marginBottom: spacing.md },
  circleWrap:       { alignItems: "center", paddingVertical: spacing.sm },
  catRow:           { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
  catDot:           { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  catName:          { fontSize: typography.fontSize.sm, color: colors.textPrimary, width: 80 },
  catBarWrap:       { flex: 1, height: 8, backgroundColor: "#F3F4F6", borderRadius: 99, overflow: "hidden", marginHorizontal: spacing.sm },
  catBar:           { height: "100%", borderRadius: 99 },
  catAmt:           { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.textPrimary, textAlign: "right" },
  catPct:           { fontSize: 9, color: colors.textSecondary, textAlign: "right" },
  empty:            { alignItems: "center", paddingVertical: spacing.xl ?? 32 },
  emptyEmoji:       { fontSize: 48, marginBottom: spacing.md },
  emptyText:        { fontSize: typography.fontSize.md, color: colors.textSecondary },
});
