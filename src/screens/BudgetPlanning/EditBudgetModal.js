import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateBudget } from "../../store/slices/budgetSlice";
import Toast from "../../components/common/Toast";
import { colors }     from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing }    from "../../theme/spacing";

const COLORS = ["#22C55E", "#3B82F6", "#A855F7", "#F59E0B", "#EF4444", "#EC4899", "#14B8A6"];

export default function EditBudgetModal({ navigation, route }) {
  const dispatch   = useDispatch();
  const { status } = useSelector((s) => s.budget);
  const budget     = route?.params?.budget;

  const [limit, setLimit] = useState(String(budget?.limit ?? ""));
  const [color, setColor] = useState(budget?.color ?? COLORS[0]);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const spentPct = budget?.limit > 0 ? Math.min(budget.spent / budget.limit, 1) : 0;

  const handleSave = async () => {
    if (!Number(limit)) return;
    await dispatch(updateBudget({ id: budget.id, limit: Number(limit), color }));
    setToast({ visible: true, message: "Đã cập nhật ngân sách!", type: "success" });
    setTimeout(() => navigation.goBack(), 1200);
  };

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
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa ngân sách</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Category display */}
        <View style={[styles.catCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
          <Text style={styles.catName}>{budget?.category}</Text>
          <Text style={styles.catGroup}>{budget?.groupTitle}</Text>

          {/* Progress */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${spentPct * 100}%`, backgroundColor: spentPct > 0.9 ? colors.expense : color }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.spentLabel}>Đã chi: {budget?.spent?.toLocaleString("vi-VN")}₫</Text>
            <Text style={styles.limitLabel}>{Math.round(spentPct * 100)}%</Text>
          </View>
        </View>

        <View style={styles.form}>
          {/* Hạn mức mới */}
          <Text style={styles.label}>Hạn mức mới (VNĐ/tháng)</Text>
          <View style={styles.amountRow}>
            <TextInput
              style={styles.amountInput}
              value={limit}
              onChangeText={setLimit}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.amountCurrency}>VNĐ</Text>
          </View>

          {/* Màu sắc */}
          <Text style={styles.label}>Màu sắc</Text>
          <View style={styles.colorRow}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorSelected]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.saveBtn, status === "pending" && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={status === "pending"}
      >
        <Text style={styles.saveBtnText}>
          {status === "pending" ? "Đang cập nhật..." : "Lưu thay đổi"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: "#fff" },
  header:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.base, paddingTop: spacing.md, paddingBottom: spacing.sm },
  closeBtn:      { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F5F5F5", justifyContent: "center", alignItems: "center" },
  closeIcon:     { fontSize: 14, color: colors.textPrimary, fontWeight: "600" },
  title:         { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  catCard:       { marginHorizontal: spacing.base, backgroundColor: "#F9FAFB", borderRadius: 14, padding: spacing.base, marginBottom: spacing.md, marginTop: spacing.md },
  catName:       { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  catGroup:      { fontSize: typography.fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md },
  progressTrack: { height: 8, backgroundColor: "#F3F4F6", borderRadius: 99, overflow: "hidden", marginBottom: 6 },
  progressBar:   { height: "100%", borderRadius: 99 },
  progressLabels:{ flexDirection: "row", justifyContent: "space-between" },
  spentLabel:    { fontSize: typography.fontSize.xs, color: colors.textSecondary },
  limitLabel:    { fontSize: typography.fontSize.xs, color: colors.textSecondary },
  form:          { paddingHorizontal: spacing.base },
  label:         { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semiBold, color: colors.textSecondary, marginBottom: 6, marginTop: spacing.md },
  amountRow:     { flexDirection: "row", alignItems: "center", backgroundColor: "#F9FAFB", borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingRight: spacing.md },
  amountInput:   { flex: 1, padding: spacing.md, fontSize: typography.fontSize.lg, color: colors.textPrimary, fontWeight: typography.fontWeight.bold },
  amountCurrency:{ fontSize: typography.fontSize.sm, color: colors.textSecondary },
  colorRow:      { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  colorDot:      { width: 36, height: 36, borderRadius: 18 },
  colorSelected: { borderWidth: 3, borderColor: "#fff", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  saveBtn:       { marginHorizontal: spacing.base, marginBottom: spacing.lg, backgroundColor: colors.primary, borderRadius: 14, padding: spacing.lg, alignItems: "center" },
  saveBtnText:   { color: "#fff", fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semiBold },
});
