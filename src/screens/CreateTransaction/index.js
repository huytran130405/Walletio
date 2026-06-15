import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction } from "../../store/slices/transactionSlice";
import BottomSheet from "../../components/common/BottomSheet";
import CategoryPicker from "../../components/common/CategoryPicker";
import WalletCard from "../../components/common/WalletCard";
import Toast from "../../components/common/Toast";
import { colors, gradients, shadows } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

const PAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "⌫"];
const TYPES = [
  { key: "expense", label: "Chi phí", color: colors.expense, bg: "#FBEDE8" },
  { key: "income", label: "Thu nhập", color: colors.income, bg: "#F0FAF3" },
];

export default function CreateTransaction({ navigation, route }) {
  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.transactions);
  const wallets = useSelector((s) => s.wallets.wallets);

  const initialType = route?.params?.initialType ?? "expense";

  const [type, setType] = useState(initialType);

  useEffect(() => {
    const incoming = route?.params?.initialType ?? "expense";
    setType(incoming);
  }, [route?.params?.initialType]);

  const [amount, setAmount] = useState("0");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [walletId, setWalletId] = useState(wallets[0]?.id ?? "");
  const [date, setDate] = useState(new Date());

  // BottomSheet visibility
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [showWalletPick, setShowWalletPick] = useState(false);

  // Toast
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const showToast = (message, t = "success") => setToast({ visible: true, message, type: t });

  const handlePad = (key) => {
    if (key === "⌫") {
      setAmount((p) => (p.length <= 1 ? "0" : p.slice(0, -1)));
    } else {
      setAmount((p) => (p === "0" ? key : (p + key).length > 12 ? p : p + key));
    }
  };

  const selectedWallet = wallets.find((w) => w.id === walletId) ?? wallets[0];

  const fmtDate = (d) => {
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSave = async () => {
    if (Number(amount) === 0) { Alert.alert("Lỗi", "Vui lòng nhập số tiền."); return; }
    if (!category) { Alert.alert("Lỗi", "Vui lòng chọn hạng mục."); return; }

    await dispatch(createTransaction({
      type,
      amount: Number(amount),
      note,
      category,
      walletId: selectedWallet?.id,
      date: fmtDate(date),
      description: note || category,
    }));

    showToast(type === "expense" ? "Đã lưu chi phí!" : "Đã lưu thu nhập!", "success");
    setAmount("0");
    setNote("");
    setCategory("");

    setTimeout(() => navigation.goBack(), 1200);
  };

  const activeType = TYPES.find((t) => t.key === type);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast((p) => ({ ...p, visible: false }))}
      />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(420)} style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Thêm giao dịch</Text>
        <View style={{ width: 36 }} />
      </Animated.View>

      {/* Type toggle */}
      <View style={styles.toggleRow}>
        {TYPES.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.toggleBtn, type === t.key && { backgroundColor: t.color }]}
            onPress={() => setType(t.key)}
          >
            <Text style={[styles.toggleText, type === t.key && styles.toggleTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Amount */}
      <Animated.View entering={FadeInUp.duration(460).springify()} style={styles.amountBlock}>
        <Text style={styles.amountLabel}>Số tiền</Text>
        <Text style={[styles.amountValue, { color: activeType?.color ?? colors.textPrimary }]}>
          {Number(amount).toLocaleString("vi-VN")} ₫
        </Text>
      </Animated.View>

      {/* Fields */}
      <View style={styles.fields}>
        {/* Hạng mục */}
        <TouchableOpacity style={styles.fieldRow} onPress={() => setShowCatPicker(true)}>
          <Text style={styles.fieldEmoji}>🏷️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Hạng mục</Text>
            <Text style={[styles.fieldValue, !category && { color: colors.textSecondary }]}>
              {category || "Chọn hạng mục"}
            </Text>
          </View>
          <Text style={styles.fieldArrow}>›</Text>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Ví tiền */}
        <TouchableOpacity style={styles.fieldRow} onPress={() => setShowWalletPick(true)}>
          <Text style={styles.fieldEmoji}>👛</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Ví tiền</Text>
            <Text style={styles.fieldValue}>{selectedWallet?.name ?? "Tiền mặt"}</Text>
          </View>
          <Text style={styles.fieldArrow}>›</Text>
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Ngày */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldEmoji}>📅</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Ngày</Text>
            <Text style={styles.fieldValue}>{fmtDate(date)}</Text>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Ghi chú */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldEmoji}>📝</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Thêm ghi chú..."
            placeholderTextColor={colors.textSecondary}
            value={note}
            onChangeText={setNote}
          />
        </View>
      </View>

      {/* Numpad */}
      <View style={styles.numpad}>
        {PAD_KEYS.map((key) => (
          <TouchableOpacity key={key} style={styles.padKey} onPress={() => handlePad(key)} activeOpacity={0.6}>
            <Text style={styles.padKeyText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Save button */}
      <TouchableOpacity
        style={[styles.saveBtn, status === "pending" && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={status === "pending"}
      >
        <LinearGradient colors={type === "income" ? gradients.forest : [colors.clay, colors.expense]} style={styles.saveGradient}>
          <Text style={styles.saveBtnText}>
            {status === "pending" ? "Đang lưu..." : "Lưu giao dịch"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Category Picker BottomSheet */}
      <BottomSheet
        visible={showCatPicker}
        onClose={() => setShowCatPicker(false)}
        title="Chọn hạng mục"
        snapHeight={480}
      >
        <CategoryPicker
          selected={category}
          onSelect={(name) => { setCategory(name); setShowCatPicker(false); }}
        />
      </BottomSheet>

      {/* Wallet Picker BottomSheet */}
      <BottomSheet
        visible={showWalletPick}
        onClose={() => setShowWalletPick(false)}
        title="Chọn ví tiền"
        snapHeight={360}
      >
        <View style={{ paddingTop: spacing.sm }}>
          {wallets.map((w) => (
            <TouchableOpacity key={w.id} onPress={() => { setWalletId(w.id); setShowWalletPick(false); }}>
              <WalletCard name={w.name} balance={w.balance} selected={walletId === w.id} />
            </TouchableOpacity>
          ))}
        </View>
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
  toggleRow: { flexDirection: "row", marginHorizontal: spacing.md, backgroundColor: colors.surfaceAlt, borderRadius: borderRadius.full, padding: spacing.xxs, marginBottom: spacing.lg },
  toggleBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.full, alignItems: "center" },
  toggleText: { fontSize: typography.fontSize.md, fontFamily: typography.family.medium, color: colors.textSecondary },
  toggleTextActive: { color: "#fff" },
  amountBlock: { alignItems: "center", paddingVertical: spacing.lg, marginHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.xxl, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg, ...shadows.soft },
  amountLabel: { fontSize: typography.fontSize.sm, color: colors.textSecondary, fontFamily: typography.family.medium },
  amountValue: { fontSize: typography.fontSize.xxxl, fontFamily: typography.family.bold, color: colors.textPrimary, marginTop: spacing.xs },
  fields: { marginHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.xl, paddingHorizontal: spacing.base, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  fieldRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.base },
  fieldEmoji: { fontSize: 18, marginRight: spacing.base },
  fieldLabel: { fontSize: typography.fontSize.xs, color: colors.textSecondary, fontFamily: typography.family.medium },
  fieldValue: { fontSize: typography.fontSize.md, fontFamily: typography.family.semiBold, color: colors.textPrimary, marginTop: 2 },
  fieldArrow: { fontSize: 20, color: colors.textSecondary },
  noteInput: { flex: 1, fontSize: typography.fontSize.md, color: colors.textPrimary, paddingVertical: 0 },
  divider: { height: 1, backgroundColor: colors.divider, marginLeft: 38 },
  numpad: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: spacing.md, marginBottom: spacing.base },
  padKey: { width: "33.33%", paddingVertical: spacing.sm, alignItems: "center" },
  padKeyText: { fontSize: typography.fontSize.xl, fontFamily: typography.family.medium, color: colors.textPrimary },
  saveBtn: { marginHorizontal: spacing.md, marginBottom: spacing.lg, borderRadius: borderRadius.full, overflow: "hidden", ...shadows.lifted },
  saveGradient: { paddingVertical: spacing.base, paddingHorizontal: spacing.md, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: typography.fontSize.base, fontFamily: typography.family.semiBold },
});
