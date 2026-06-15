import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { colors, shadows } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

const WALLET_ICONS = {
  "Tiền mặt": { emoji: "💵", bg: "#E8F4DC" },
  "Tài khoản ngân hàng": { emoji: "🏦", bg: "#DDEFF5" },
  "Ví điện tử": { emoji: "📱", bg: "#F7E4BC" },
  "default": { emoji: "👛", bg: "#EEF5EA" },
};

/**
 * WalletCard — row with wallet icon, name, and balance
 */
export default function WalletCard({ name = "Ví", balance = 0, selected = false }) {
  const icon = WALLET_ICONS[name] ?? WALLET_ICONS["default"];

  return (
    <Animated.View entering={FadeInUp.duration(420).springify()} style={[styles.card, selected && styles.cardSelected]}>
      <View style={[styles.iconWrap, { backgroundColor: icon.bg }]}>
        <Text style={styles.emoji}>{icon.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.balance}>{balance.toLocaleString("vi-VN")}₫</Text>
      </View>
      {selected && <View style={styles.dot} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: "#F3FAF4" },
  iconWrap: { width: 50, height: 50, borderRadius: borderRadius.md, justifyContent: "center", alignItems: "center", marginRight: spacing.base },
  emoji: { fontSize: 24 },
  info: { flex: 1 },
  name: { fontSize: typography.fontSize.md, fontFamily: typography.family.medium, color: colors.textSecondary },
  balance: { fontSize: typography.fontSize.lg, fontFamily: typography.family.bold, color: colors.textPrimary, marginTop: 4 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
});
