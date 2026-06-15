import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";

const CATEGORY_ICONS = {
  "Ăn uống":   { emoji: "🍜", bg: "#FEF3C7" },
  "Nhà cửa":   { emoji: "🏠", bg: "#DBEAFE" },
  "Di chuyển": { emoji: "🚗", bg: "#E0E7FF" },
  "Giải trí":  { emoji: "🎮", bg: "#FCE7F3" },
  "Mua sắm":   { emoji: "🛍️", bg: "#F3E8FF" },
  "Lương":     { emoji: "💼", bg: "#DCFCE7" },
  "Thưởng":    { emoji: "🎁", bg: "#DCFCE7" },
  "Khác":      { emoji: "📦", bg: "#F1F5F9" },
  "default":   { emoji: "💰", bg: "#F1F5F9" },
};

/**
 * TransactionItem — single row in transaction history list
 */
export default function TransactionItem({ description = "Giao dịch", category = "", amount = 0, type = "expense", date = "" }) {
  const isIncome = type === "income";
  const icon = CATEGORY_ICONS[category] ?? CATEGORY_ICONS["default"];

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: icon.bg }]}>
        <Text style={styles.emoji}>{icon.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.desc} numberOfLines={1}>{description}</Text>
        {!!date && <Text style={styles.date}>{date}</Text>}
      </View>
      <Text style={[styles.amount, { color: isIncome ? colors.income : colors.expense }]}>
        {isIncome ? "+" : "-"}{Math.abs(amount).toLocaleString("vi-VN")}₫
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row:      { flexDirection: "row", alignItems: "center", paddingVertical: spacing.sm },
  iconWrap: { width: 40, height: 40, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: spacing.md },
  emoji:    { fontSize: 20 },
  info:     { flex: 1 },
  desc:     { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.medium, color: colors.textPrimary },
  date:     { fontSize: typography.fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  amount:   { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semiBold },
});
