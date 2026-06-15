import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, ScrollView, Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createBudget } from "../../store/slices/budgetSlice";
import CategoryPicker from "../../components/common/CategoryPicker";
import BottomSheet    from "../../components/common/BottomSheet";
import Toast          from "../../components/common/Toast";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradients, shadows } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

const COLORS = [colors.primary, colors.info, colors.accent, colors.clay, colors.expense, colors.secondaryDark, colors.earth];
const GROUPS = ["🔴 Thiết yếu", "🟠 Di chuyển", "🟡 Mong muốn", "🔵 Khác"];

export default function AddBudgetModal({ navigation }) {
  const dispatch   = useDispatch();
  const { status } = useSelector((s) => s.budget);

  const [category,   setCategory]   = useState("");
  const [limit,      setLimit]      = useState("");
  const [groupTitle, setGroupTitle] = useState(GROUPS[0]);
  const [color,      setColor]      = useState(COLORS[0]);
  const [showCat,    setShowCat]    = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const handleSave = async () => {
    if (!category)        { Alert.alert("Lỗi", "Vui lòng chọn hạng mục."); return; }
    if (!Number(limit))   { Alert.alert("Lỗi", "Vui lòng nhập hạn mức chi tiêu."); return; }

    await dispatch(createBudget({
      category,
      limit:      Number(limit),
      period:     "monthly",
      color,
      groupTitle,
    }));

    setToast({ visible: true, message: `Đã thêm ngân sách "${category}"!`, type: "success" });
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
        <Text style={styles.title}>Thêm ngân sách</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Hạng mục */}
          <Text style={styles.label}>Hạng mục</Text>
          <TouchableOpacity style={styles.selectBtn} onPress={() => setShowCat(true)}>
            <Text style={[styles.selectText, !category && { color: colors.textSecondary }]}>
              {category || "Chọn hạng mục..."}
            </Text>
            <Text style={styles.selectArrow}>›</Text>
          </TouchableOpacity>

          {/* Hạn mức */}
          <Text style={styles.label}>Hạn mức chi tiêu</Text>
          <View style={styles.amountRow}>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              value={limit}
              onChangeText={setLimit}
              keyboardType="numeric"
            />
            <Text style={styles.amountCurrency}>VNĐ / tháng</Text>
          </View>

          {/* Nhóm */}
          <Text style={styles.label}>Nhóm phân loại</Text>
          {GROUPS.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.groupBtn, groupTitle === g && { borderColor: colors.primary, backgroundColor: colors.surfaceAlt }]}
              onPress={() => setGroupTitle(g)}
            >
              <Text style={[styles.groupText, groupTitle === g && { color: colors.primary, fontFamily: typography.family.semiBold }]}>
                {g}
              </Text>
              {groupTitle === g && <Text style={{ color: colors.primary }}>✓</Text>}
            </TouchableOpacity>
          ))}

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
        <LinearGradient colors={gradients.forest} style={styles.saveGradient}>
          <Text style={styles.saveBtnText}>
            {status === "pending" ? "Đang lưu..." : "Thêm ngân sách"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Category picker */}
      <BottomSheet visible={showCat} onClose={() => setShowCat(false)} title="Chọn hạng mục" snapHeight={480}>
        <CategoryPicker selected={category} onSelect={(n) => { setCategory(n); setShowCat(false); }} />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.md },
  closeBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center", ...shadows.soft },
  closeIcon: { fontSize: 14, color: colors.textPrimary, fontFamily: typography.family.semiBold },
  title: { fontSize: typography.fontSize.lg, fontFamily: typography.family.bold, color: colors.textPrimary },
  form: { paddingHorizontal: spacing.md, paddingBottom: spacing.base },
  label: { fontSize: typography.fontSize.sm, fontFamily: typography.family.semiBold, color: colors.textSecondary, marginBottom: 6, marginTop: spacing.base },
  selectBtn: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.base, borderWidth: 1, borderColor: colors.border },
  selectText: { fontSize: typography.fontSize.md, color: colors.textPrimary, fontFamily: typography.family.medium },
  selectArrow:    { fontSize: 20, color: colors.textSecondary },
  amountRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, paddingRight: spacing.base },
  amountInput:    { flex: 1, padding: spacing.base, fontSize: typography.fontSize.md, color: colors.textPrimary },
  amountCurrency: { fontSize: typography.fontSize.sm, color: colors.textSecondary },
  groupBtn: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.base, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xs, backgroundColor: colors.surface },
  groupText: { fontSize: typography.fontSize.md, color: colors.textPrimary, fontFamily: typography.family.medium },
  colorRow:       { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  colorDot:       { width: 36, height: 36, borderRadius: 18 },
  colorSelected: { borderWidth: 3, borderColor: colors.surface, ...shadows.soft },
  saveBtn: { marginHorizontal: spacing.md, marginBottom: spacing.lg, borderRadius: borderRadius.full, overflow: "hidden", ...shadows.lifted },
  saveGradient: { paddingVertical: spacing.base, paddingHorizontal: spacing.md, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: typography.fontSize.base, fontFamily: typography.family.semiBold },
});
