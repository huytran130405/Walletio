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
import { colors }     from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing }    from "../../theme/spacing";

const COLORS = ["#22C55E", "#3B82F6", "#A855F7", "#F59E0B", "#EF4444", "#EC4899", "#14B8A6"];
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
              style={[styles.groupBtn, groupTitle === g && { borderColor: colors.primary, backgroundColor: "#EEF9F3" }]}
              onPress={() => setGroupTitle(g)}
            >
              <Text style={[styles.groupText, groupTitle === g && { color: colors.primary, fontWeight: typography.fontWeight.semiBold }]}>
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
        <Text style={styles.saveBtnText}>
          {status === "pending" ? "Đang lưu..." : "Thêm ngân sách"}
        </Text>
      </TouchableOpacity>

      {/* Category picker */}
      <BottomSheet visible={showCat} onClose={() => setShowCat(false)} title="Chọn hạng mục" snapHeight={480}>
        <CategoryPicker selected={category} onSelect={(n) => { setCategory(n); setShowCat(false); }} />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: "#fff" },
  header:         { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.base, paddingTop: spacing.md, paddingBottom: spacing.sm },
  closeBtn:       { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F5F5F5", justifyContent: "center", alignItems: "center" },
  closeIcon:      { fontSize: 14, color: colors.textPrimary, fontWeight: "600" },
  title:          { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  form:           { paddingHorizontal: spacing.base, paddingBottom: spacing.base },
  label:          { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semiBold, color: colors.textSecondary, marginBottom: 6, marginTop: spacing.md },
  selectBtn:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F9FAFB", borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  selectText:     { fontSize: typography.fontSize.md, color: colors.textPrimary, fontWeight: typography.fontWeight.medium },
  selectArrow:    { fontSize: 20, color: colors.textSecondary },
  amountRow:      { flexDirection: "row", alignItems: "center", backgroundColor: "#F9FAFB", borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingRight: spacing.md },
  amountInput:    { flex: 1, padding: spacing.md, fontSize: typography.fontSize.md, color: colors.textPrimary },
  amountCurrency: { fontSize: typography.fontSize.sm, color: colors.textSecondary },
  groupBtn:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.md, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xs ?? 4 },
  groupText:      { fontSize: typography.fontSize.md, color: colors.textPrimary },
  colorRow:       { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  colorDot:       { width: 36, height: 36, borderRadius: 18 },
  colorSelected:  { borderWidth: 3, borderColor: "#fff", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  saveBtn:        { marginHorizontal: spacing.base, marginBottom: spacing.lg, backgroundColor: colors.primary, borderRadius: 14, padding: spacing.lg, alignItems: "center" },
  saveBtnText:    { color: "#fff", fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semiBold },
});
