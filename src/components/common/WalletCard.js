import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";

const WALLET_ICONS = {
  "Tiền mặt":            { emoji: "💵", bg: "#DCFCE7" },
  "Tài khoản ngân hàng": { emoji: "🏦", bg: "#DBEAFE" },
  "Ví điện tử":          { emoji: "📱", bg: "#F3E8FF" },
  "default":             { emoji: "👛", bg: "#F1F5F9" },
};

/**
 * WalletCard — row with wallet icon, name, and balance
 */
export default function WalletCard({ name = "Ví", balance = 0, selected = false }) {
  const icon = WALLET_ICONS[name] ?? WALLET_ICONS["default"];

  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <View style={[styles.iconWrap, { backgroundColor: icon.bg }]}>
        <Text style={styles.emoji}>{icon.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.balance}>{balance.toLocaleString("vi-VN")}₫</Text>
      </View>
      {selected && <View style={styles.dot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card:         { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  cardSelected: { borderColor: colors.primary },
  iconWrap:     { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: spacing.md },
  emoji:        { fontSize: 22 },
  info:         { flex: 1 },
  name:         { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.medium, color: colors.textPrimary },
  balance:      { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginTop: 2 },
  dot:          { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
});
