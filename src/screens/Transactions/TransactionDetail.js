import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { deleteTransaction } from "../../store/slices/transactionSlice";
import Toast from "../../components/common/Toast";
import { colors }     from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing }    from "../../theme/spacing";

const CATEGORY_ICONS = {
  "Ăn uống":   { emoji: "🍜", bg: "#FEF3C7" },
  "Nhà cửa":   { emoji: "🏠", bg: "#DBEAFE" },
  "Di chuyển": { emoji: "🚗", bg: "#E0E7FF" },
  "Giải trí":  { emoji: "🎮", bg: "#FCE7F3" },
  "Mua sắm":   { emoji: "🛍️", bg: "#F3E8FF" },
  "Lương":     { emoji: "💼", bg: "#DCFCE7" },
  "Thưởng":    { emoji: "🎁", bg: "#DCFCE7" },
  "Sức khoẻ":  { emoji: "💊", bg: "#DCFCE7" },
  "Giáo dục":  { emoji: "📚", bg: "#E0F2FE" },
  "Khác":      { emoji: "📦", bg: "#F1F5F9" },
  "default":   { emoji: "💰", bg: "#F1F5F9" },
};

export default function TransactionDetail({ navigation, route }) {
  const dispatch    = useDispatch();
  const transaction = route?.params?.transaction;
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  if (!transaction) {
    return (
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text>✕</Text>
        </TouchableOpacity>
        <Text style={{ textAlign: "center", marginTop: 40 }}>Không tìm thấy giao dịch</Text>
      </SafeAreaView>
    );
  }

  const icon      = CATEGORY_ICONS[transaction.category] ?? CATEGORY_ICONS["default"];
  const isIncome  = transaction.type === "income";
  const amtColor  = isIncome ? colors.income : colors.expense;
  const amtPrefix = isIncome ? "+" : "-";

  const handleDelete = () => {
    Alert.alert(
      "Xoá giao dịch",
      `Bạn có chắc muốn xoá "${transaction.description}"?`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xoá",
          style: "destructive",
          onPress: () => {
            dispatch(deleteTransaction(transaction.id));
            setToast({ visible: true, message: "Đã xoá giao dịch!", type: "success" });
            setTimeout(() => navigation.goBack(), 1200);
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate("CreateTransaction", {
      initialType: transaction.type,
      editData:    transaction,
    });
  };

  const INFO_ROWS = [
    { label: "Danh mục",      value: transaction.category },
    { label: "Ví tiền",       value: transaction.walletId ?? "Tiền mặt" },
    { label: "Ngày",          value: transaction.date },
    { label: "Loại giao dịch",value: isIncome ? "Thu nhập" : "Chi phí" },
    ...(transaction.note ? [{ label: "Ghi chú", value: transaction.note }] : []),
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast((p) => ({ ...p, visible: false }))}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết giao dịch</Text>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Amount hero */}
        <View style={[styles.heroCard, { borderColor: amtColor }]}>
          <View style={[styles.iconWrap, { backgroundColor: icon.bg }]}>
            <Text style={styles.iconEmoji}>{icon.emoji}</Text>
          </View>
          <Text style={styles.description}>{transaction.description}</Text>
          <Text style={[styles.amount, { color: amtColor }]}>
            {amtPrefix}{Math.abs(transaction.amount).toLocaleString("vi-VN")} ₫
          </Text>
          <View style={[styles.typeBadge, { backgroundColor: amtColor + "20", borderColor: amtColor }]}>
            <Text style={[styles.typeBadgeText, { color: amtColor }]}>
              {isIncome ? "Thu nhập" : "Chi phí"}
            </Text>
          </View>
        </View>

        {/* Info rows */}
        <View style={styles.infoCard}>
          {INFO_ROWS.map((row, i) => (
            <View key={i}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoValue}>{row.value}</Text>
              </View>
              {i < INFO_ROWS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Edit button */}
        <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
          <Text style={styles.editBtnText}>✏️  Chỉnh sửa giao dịch</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: "#F4F6F9" },
  header:          { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.base, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  backBtn:         { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F0F0F0", justifyContent: "center", alignItems: "center" },
  backIcon:        { fontSize: 18 },
  title:           { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  deleteBtn:       { width: 36, height: 36, borderRadius: 18, backgroundColor: "#FEE2E2", justifyContent: "center", alignItems: "center" },
  deleteIcon:      { fontSize: 16 },
  heroCard:        { marginHorizontal: spacing.base, backgroundColor: "#fff", borderRadius: 20, padding: spacing.xl, alignItems: "center", marginBottom: spacing.md, borderWidth: 1.5 },
  iconWrap:        { width: 72, height: 72, borderRadius: 20, justifyContent: "center", alignItems: "center", marginBottom: spacing.md },
  iconEmoji:       { fontSize: 36 },
  description:     { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.sm, textAlign: "center" },
  amount:          { fontSize: 32, fontWeight: typography.fontWeight.bold, marginBottom: spacing.sm },
  typeBadge:       { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  typeBadgeText:   { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semiBold },
  infoCard:        { marginHorizontal: spacing.base, backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: spacing.base, marginBottom: spacing.md },
  infoRow:         { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.md },
  infoLabel:       { fontSize: typography.fontSize.sm, color: colors.textSecondary },
  infoValue:       { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.medium, color: colors.textPrimary, maxWidth: "60%", textAlign: "right" },
  divider:         { height: 1, backgroundColor: "#F3F4F6" },
  editBtn:         { marginHorizontal: spacing.base, padding: spacing.lg, borderRadius: 14, borderWidth: 1.5, borderColor: colors.primary, alignItems: "center" },
  editBtnText:     { color: colors.primary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semiBold },
});
