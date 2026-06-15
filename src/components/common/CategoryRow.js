import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";

const ICON_MAP = {
  "Ăn uống":     { emoji: "🍜", bg: "#FEF3C7" },
  "Nhà cửa":     { emoji: "🏠", bg: "#DBEAFE" },
  "Di chuyển":   { emoji: "🚗", bg: "#E0E7FF" },
  "Giải trí":    { emoji: "🎮", bg: "#FCE7F3" },
  "Mua sắm":     { emoji: "🛍️", bg: "#F3E8FF" },
  "Cà phê":      { emoji: "☕", bg: "#FEF3C7" },
  "Sức khoẻ":    { emoji: "💊", bg: "#DCFCE7" },
  "Giáo dục":    { emoji: "📚", bg: "#E0F2FE" },
  "Lương":       { emoji: "💼", bg: "#DCFCE7" },
  "Khác":        { emoji: "📦", bg: "#F1F5F9" },
  "default":     { emoji: "💰", bg: "#F1F5F9" },
};

/**
 * CategoryRow — shows icon, name, optional progress bar, and amount
 */
export default function CategoryRow({
  name = "Danh mục",
  amount = 0,
  budget = 0,
  showBar = false,
  barColor = colors.primary,
  amountColor,
}) {
  const icon = ICON_MAP[name] ?? ICON_MAP["default"];
  const progress = budget > 0 ? Math.min(amount / budget, 1) : 0;
  const displayColor = amountColor ?? colors.textPrimary;

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: icon.bg }]}>
        <Text style={styles.emoji}>{icon.emoji}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{name}</Text>
          <Text style={[styles.amount, { color: displayColor }]}>
            {amount.toLocaleString("vi-VN")}₫
          </Text>
        </View>
        {showBar && (
          <View style={styles.track}>
            <View style={[styles.bar, { width: `${progress * 100}%`, backgroundColor: barColor }]} />
          </View>
        )}
        {budget > 0 && (
          <Text style={styles.budget}>VNĐ {budget.toLocaleString("vi-VN")}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row:      { flexDirection: "row", alignItems: "center", paddingVertical: spacing.sm },
  iconWrap: { width: 40, height: 40, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: spacing.md },
  emoji:    { fontSize: 20 },
  content:  { flex: 1 },
  topRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name:     { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.medium, color: colors.textPrimary },
  amount:   { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semiBold },
  track:    { height: 6, backgroundColor: "#F3F4F6", borderRadius: 99, marginTop: 4, overflow: "hidden" },
  bar:      { height: "100%", borderRadius: 99 },
  budget:   { fontSize: typography.fontSize.xs, color: colors.textSecondary, marginTop: 2 },
});
