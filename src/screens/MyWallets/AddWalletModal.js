import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, Alert, ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addWallet } from "../../store/slices/walletSlice";
import Toast          from "../../components/common/Toast";
import { colors }     from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing }    from "../../theme/spacing";

const WALLET_TYPES = [
  { key: "cash",    label: "Tiền mặt",            emoji: "💵", color: "#22C55E" },
  { key: "bank",    label: "Tài khoản ngân hàng", emoji: "🏦", color: "#3B82F6" },
  { key: "ewallet", label: "Ví điện tử",           emoji: "📱", color: "#A855F7" },
];
const COLORS = ["#22C55E", "#3B82F6", "#A855F7", "#F59E0B", "#EF4444", "#EC4899", "#14B8A6"];

export default function AddWalletModal({ navigation }) {
  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.wallets);

  const [name,    setName]    = useState("");
  const [balance, setBalance] = useState("0");
  const [type,    setType]    = useState("cash");
  const [color,   setColor]   = useState(COLORS[0]);
  const [toast,   setToast]   = useState({ visible: false, message: "", type: "success" });

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert("Lỗi", "Vui lòng nhập tên ví."); return; }
    if (Number(balance) < 0) { Alert.alert("Lỗi", "Số dư không được âm."); return; }

    const walletType = WALLET_TYPES.find((t) => t.key === type);
    await dispatch(addWallet({
      name:    name.trim(),
      balance: Number(balance),
      type,
      color,
      label:   walletType?.label ?? name,
    }));

    setToast({ visible: true, message: `Đã thêm ví "${name.trim()}"!`, type: "success" });
    setTimeout(() => navigation.goBack(), 1200);
  };

  const selectedType = WALLET_TYPES.find((t) => t.key === type);

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
        <Text style={styles.title}>Thêm ví mới</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Icon preview */}
        <View style={styles.previewWrap}>
          <View style={[styles.previewIcon, { backgroundColor: color + "33" }]}>
            <Text style={styles.previewEmoji}>{selectedType?.emoji}</Text>
          </View>
          <Text style={styles.previewName}>{name || "Tên ví"}</Text>
        </View>

        <View style={styles.form}>
          {/* Tên ví */}
          <Text style={styles.label}>Tên ví</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên ví..."
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            maxLength={30}
          />

          {/* Số dư ban đầu */}
          <Text style={styles.label}>Số dư ban đầu</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
            value={balance}
            onChangeText={setBalance}
            keyboardType="numeric"
          />

          {/* Loại ví */}
          <Text style={styles.label}>Loại ví</Text>
          <View style={styles.typeRow}>
            {WALLET_TYPES.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[styles.typeBtn, type === t.key && { borderColor: t.color, backgroundColor: t.color + "15" }]}
                onPress={() => { setType(t.key); setColor(t.color); }}
              >
                <Text style={styles.typeEmoji}>{t.emoji}</Text>
                <Text style={[styles.typeLabel, type === t.key && { color: t.color, fontWeight: typography.fontWeight.semiBold }]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Màu sắc */}
          <Text style={styles.label}>Màu sắc</Text>
          <View style={styles.colorRow}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Save button */}
      <TouchableOpacity
        style={[styles.saveBtn, status === "pending" && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={status === "pending"}
      >
        <Text style={styles.saveBtnText}>
          {status === "pending" ? "Đang lưu..." : "Tạo ví"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: "#fff" },
  header:            { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.base, paddingTop: spacing.md, paddingBottom: spacing.sm },
  closeBtn:          { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F5F5F5", justifyContent: "center", alignItems: "center" },
  closeIcon:         { fontSize: 14, color: colors.textPrimary, fontWeight: "600" },
  title:             { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  previewWrap:       { alignItems: "center", paddingVertical: spacing.xl },
  previewIcon:       { width: 80, height: 80, borderRadius: 24, justifyContent: "center", alignItems: "center", marginBottom: spacing.sm },
  previewEmoji:      { fontSize: 36 },
  previewName:       { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  form:              { paddingHorizontal: spacing.base, paddingBottom: spacing.base },
  label:             { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semiBold, color: colors.textSecondary, marginBottom: spacing.xs ?? 4, marginTop: spacing.md },
  input:             { backgroundColor: "#F9FAFB", borderRadius: 12, padding: spacing.md, fontSize: typography.fontSize.md, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  typeRow:           { gap: spacing.sm },
  typeBtn:           { flexDirection: "row", alignItems: "center", padding: spacing.md, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, marginBottom: spacing.xs ?? 4 },
  typeEmoji:         { fontSize: 22, marginRight: spacing.md },
  typeLabel:         { fontSize: typography.fontSize.md, color: colors.textPrimary },
  colorRow:          { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  colorDot:          { width: 34, height: 34, borderRadius: 17 },
  colorDotSelected:  { borderWidth: 3, borderColor: "#fff", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  saveBtn:           { marginHorizontal: spacing.base, marginBottom: spacing.lg, backgroundColor: colors.primary, borderRadius: 14, padding: spacing.lg, alignItems: "center" },
  saveBtnText:       { color: "#fff", fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semiBold },
});
