import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchWallets, deleteWallet, selectTotalBalance } from "../../store/slices/walletSlice";
import WalletCard  from "../../components/common/WalletCard";
import { colors }  from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing }    from "../../theme/spacing";

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
        <View style={styles.header}>
          <View style={styles.avatar}><Text style={styles.avatarText}>👛</Text></View>
          <Text style={styles.name}>Ví của tôi</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Text>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Total balance hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Tổng số dư</Text>
          <Text style={styles.heroAmount}>{totalBalance.toLocaleString("vi-VN")} ₫</Text>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => navigation.navigate("BudgetPlanning")}
          >
            <Text style={styles.heroBtnText}>📊 Kiểm soát số dư</Text>
          </TouchableOpacity>
        </View>

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
  safe:            { flex: 1, backgroundColor: "#F4F6F9" },
  header:          { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.base, paddingTop: spacing.lg, paddingBottom: spacing.md },
  avatar:          { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", marginRight: spacing.sm },
  avatarText:      { fontSize: 20 },
  name:            { flex: 1, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semiBold, color: colors.textPrimary },
  settingsBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F0F0F0", justifyContent: "center", alignItems: "center" },
  heroCard:        { marginHorizontal: spacing.base, backgroundColor: colors.primary, borderRadius: 20, padding: spacing.xl, marginBottom: spacing.lg, alignItems: "center" },
  heroLabel:       { fontSize: typography.fontSize.sm, color: "rgba(255,255,255,0.7)" },
  heroAmount:      { fontSize: typography.fontSize.huge, fontWeight: typography.fontWeight.bold, color: "#fff", marginVertical: spacing.sm },
  heroBtn:         { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  heroBtnText:     { color: "#fff", fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium },
  section:         { paddingHorizontal: spacing.base, marginBottom: spacing.md },
  sectionRow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
  sectionTitle:    { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semiBold, color: colors.textPrimary },
  addLink:         { fontSize: typography.fontSize.md, color: colors.primary, fontWeight: typography.fontWeight.medium },
  empty:           { backgroundColor: "#fff", borderRadius: 12, padding: spacing.xl, alignItems: "center" },
  emptyText:       { color: colors.textSecondary, textAlign: "center" },
  transferBtn:     { marginHorizontal: spacing.base, padding: spacing.lg, borderRadius: 14, borderWidth: 1.5, borderColor: colors.primary, alignItems: "center" },
  transferBtnText: { color: colors.primary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semiBold },
});
