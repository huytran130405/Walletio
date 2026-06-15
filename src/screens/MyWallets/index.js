import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSelector, useDispatch } from "react-redux";
import { fetchWallets, deleteWallet, selectTotalBalance } from "../../store/slices/walletSlice";
import WalletCard  from "../../components/common/WalletCard";
import { colors, gradients, shadows } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

export default function MyWallets({ navigation }) {
  const dispatch   = useDispatch();
  const wallets    = useSelector((s) => s.wallets.wallets);
  const totalBalance = useSelector((s) => selectTotalBalance(s));

  useEffect(() => {
    dispatch(fetchWallets());
  }, []);

  const handleDelete = (wallet) => {
    Alert.alert(
      "Xoá ví",
      `Bạn có chắc muốn xoá ví "${wallet.name}"?`,
      [
        { text: "Huỷ", style: "cancel" },
        { text: "Xoá", style: "destructive", onPress: () => dispatch(deleteWallet(wallet.id)) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(450)} style={styles.header}>
          <View style={styles.avatar}><Text style={styles.avatarText}>👛</Text></View>
          <Text style={styles.name}>Ví của tôi</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Text>⚙️</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Total balance hero */}
        <Animated.View entering={FadeInUp.duration(500).springify()} style={styles.heroCard}>
          <LinearGradient colors={gradients.forest} style={styles.heroGradient}>
          <Text style={styles.heroLabel}>Tổng số dư</Text>
          <Text style={styles.heroAmount}>{totalBalance.toLocaleString("vi-VN")} ₫</Text>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => navigation.navigate("BudgetPlanning")}
          >
            <Text style={styles.heroBtnText}>📊 Kiểm soát số dư</Text>
          </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Wallet list */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Danh sách ví</Text>
            <TouchableOpacity onPress={() => navigation.navigate("AddWallet")}>
              <Text style={styles.addLink}>+ Thêm</Text>
            </TouchableOpacity>
          </View>

          {wallets.map((w) => (
            <TouchableOpacity
              key={w.id}
              onLongPress={() => handleDelete(w)}
              activeOpacity={0.8}
            >
              <WalletCard name={w.name} balance={w.balance} />
            </TouchableOpacity>
          ))}

          {wallets.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Chưa có ví nào. Nhấn "+ Thêm" để tạo ví mới.</Text>
            </View>
          )}
        </View>

        {/* Transfer button */}
        <TouchableOpacity
          style={styles.transferBtn}
          onPress={() => navigation.navigate("TransferMoney")}
        >
          <Text style={styles.transferBtnText}>↔️  Chuyển tiền giữa các ví</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.md },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceAlt, justifyContent: "center", alignItems: "center", marginRight: spacing.sm, borderWidth: 1, borderColor: colors.border },
  avatarText:      { fontSize: 20 },
  name: { flex: 1, fontSize: typography.fontSize.lg, fontFamily: typography.family.bold, color: colors.textPrimary },
  settingsBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center", ...shadows.soft },
  heroCard: { marginHorizontal: spacing.md, borderRadius: borderRadius.xxl, marginBottom: spacing.lg, overflow: "hidden", ...shadows.lifted },
  heroGradient: { padding: spacing.xl, alignItems: "center" },
  heroLabel: { fontSize: typography.fontSize.sm, color: "rgba(255,255,255,0.72)", fontFamily: typography.family.medium },
  heroAmount: { fontSize: typography.fontSize.huge, fontFamily: typography.family.bold, color: "#fff", marginVertical: spacing.sm, textAlign: "center" },
  heroBtn: { backgroundColor: "rgba(255,255,255,0.18)", borderRadius: borderRadius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  heroBtnText: { color: "#fff", fontSize: typography.fontSize.sm, fontFamily: typography.family.semiBold },
  section: { paddingHorizontal: spacing.md, marginBottom: spacing.base },
  sectionRow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
  sectionTitle: { fontSize: typography.fontSize.lg, fontFamily: typography.family.bold, color: colors.textPrimary },
  addLink: { fontSize: typography.fontSize.md, color: colors.primary, fontFamily: typography.family.semiBold },
  empty: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  emptyText:       { color: colors.textSecondary, textAlign: "center" },
  transferBtn: { marginHorizontal: spacing.md, marginBottom: spacing.lg, borderRadius: borderRadius.full, paddingVertical: spacing.base, paddingHorizontal: spacing.md, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
  transferBtnText: { color: colors.primaryDark, fontSize: typography.fontSize.md, fontFamily: typography.family.semiBold },
});
