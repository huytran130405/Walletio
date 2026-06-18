import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction, updateTransaction } from "../../store/slices/transactionSlice";
import { fetchWallets, fetchWalletSummary } from "../../store/slices/walletSlice";
import BottomSheet from "../../components/common/BottomSheet";
import CategoryPicker from "../../components/common/CategoryPicker";
import WalletCard from "../../components/common/WalletCard";
import Toast from "../../components/common/Toast";
import { colors, gradients, shadows } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

const PAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "⌫"];
const TYPES = [
  { key: "expense", label: "Chi phí", color: colors.expense },
  { key: "income", label: "Thu nhập", color: colors.income },
];

const fmtDate = (d) => {
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function CreateTransaction({ navigation, route }) {
  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.transactions);
  const wallets = useSelector((s) => s.wallets.wallets);
  const categories = useSelector((s) => s.categories.categories);
  const emotions = useSelector((s) => s.emotions.emotions);

  const editData = route?.params?.editData;
  const initialType = route?.params?.initialType ?? "expense";

  const [type, setType] = useState(editData?.type ?? initialType);
  const [amount, setAmount] = useState(String(Math.abs(editData?.amount ?? 0)));
  const [note, setNote] = useState(editData?.note ?? "");
  const [category, setCategory] = useState(editData?.category ?? "");
  const [categoryId, setCategoryId] = useState(editData?.categoryId ?? "");
  const [walletId, setWalletId] = useState(route?.params?.walletId ?? editData?.walletId ?? wallets[0]?.id ?? "");
  const [date] = useState(new Date());
  const [emotionId, setEmotionId] = useState(editData?.emotionId ?? "");
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [showWalletPick, setShowWalletPick] = useState(false);
  const [showEmotionPicker, setShowEmotionPicker] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  useEffect(() => {
    const incoming = route?.params?.initialType ?? "expense";
    setType(editData?.type ?? incoming);
    if (editData) {
      setAmount(String(Math.abs(editData.amount ?? 0)));
      setNote(editData.note ?? "");
      setCategory(editData.category ?? "");
      setCategoryId(editData.categoryId ?? "");
      setWalletId(editData.walletId ?? wallets[0]?.id ?? "");
      setEmotionId(editData.emotionId ?? "");
    } else if (route?.params?.walletId) {
      setWalletId(route.params.walletId);
    }
  }, [route?.params?.initialType, route?.params?.walletId, editData?.id]);

  const selectedWallet = wallets.find((w) => w.id === walletId) ?? wallets[0];
  const selectedCategory = categories.find((item) => item.id === categoryId || item.name === category);
  const selectedEmotion = emotions.find((emotion) => emotion.id === emotionId);
  const activeType = TYPES.find((t) => t.key === type);
  const dateLabel = editData?.date ?? fmtDate(date);

  const showToast = (message, toastType = "success") =>
    setToast({ visible: true, message, type: toastType });

  const handlePad = (key) => {
    if (key === "⌫") {
      setAmount((p) => (p.length <= 1 ? "0" : p.slice(0, -1)));
      return;
    }
    setAmount((p) => (p === "0" ? key : (p + key).length > 12 ? p : p + key));
  };

  const handleSave = async () => {
    if (Number(amount) === 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền.");
      return;
    }
    if (!category) {
      Alert.alert("Lỗi", "Vui lòng chọn hạng mục.");
      return;
    }

    const payload = {
      type,
      amount: Number(amount),
      direction: type === "income" ? "in" : "out",
      note,
      categoryId: selectedCategory?.id ?? categoryId,
      category,
      walletId: selectedWallet?.id,
      date: dateLabel,
      expense_date: dateLabel,
      description: note || category,
      emotionId,
    };

    try {
      if (editData) {
        await dispatch(updateTransaction({ id: editData.id, ...payload })).unwrap();
      } else {
        await dispatch(createTransaction(payload)).unwrap();
      }
      dispatch(fetchWallets());
      dispatch(fetchWalletSummary());
      showToast(editData ? "Đã cập nhật giao dịch!" : "Đã lưu giao dịch!");
      setTimeout(() => navigation.goBack(), 900);
    } catch (error) {
      Alert.alert("Không lưu được giao dịch", error || "Vui lòng thử lại.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast((p) => ({ ...p, visible: false }))}
      />

      <Animated.View entering={FadeInDown.duration(420)} style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{editData ? "Sửa giao dịch" : "Thêm giao dịch"}</Text>
        <View style={{ width: 42 }} />
      </Animated.View>

      <View style={styles.toggleRow}>
        {TYPES.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.toggleBtn, type === item.key && { backgroundColor: item.color }]}
            onPress={() => {
              setType(item.key);
              setCategory("");
              setCategoryId("");
            }}
          >
            <Text style={[styles.toggleText, type === item.key && styles.toggleTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View entering={FadeInUp.duration(460).springify()} style={styles.amountBlock}>
        <Text style={styles.amountLabel}>Số tiền</Text>
        <Text style={[styles.amountValue, { color: activeType?.color ?? colors.textPrimary }]}>
          {Number(amount).toLocaleString("vi-VN")} ₫
        </Text>
      </Animated.View>

      <View style={styles.fields}>
        <TouchableOpacity style={styles.fieldRow} onPress={() => setShowCatPicker(true)}>
          <View style={styles.fieldIcon}>
            <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Hạng mục</Text>
            <Text style={[styles.fieldValue, !category && { color: colors.textSecondary }]}>
              {category || "Chọn hạng mục"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
        <View style={styles.divider} />

        <TouchableOpacity style={styles.fieldRow} onPress={() => setShowWalletPick(true)}>
          <View style={styles.fieldIcon}>
            <Ionicons name="wallet-outline" size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Ví tiền</Text>
            <Text style={styles.fieldValue}>{selectedWallet?.name ?? "Tiền mặt"}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
        <View style={styles.divider} />

        <View style={styles.fieldRow}>
          <View style={styles.fieldIcon}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Ngày</Text>
            <Text style={styles.fieldValue}>{dateLabel}</Text>
          </View>
        </View>
        <View style={styles.divider} />

        <TouchableOpacity style={styles.fieldRow} onPress={() => setShowEmotionPicker(true)}>
          <View style={styles.fieldIcon}>
            <Ionicons name={selectedEmotion?.icon || "heart-outline"} size={18} color={selectedEmotion?.color || colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Cảm xúc</Text>
            <Text style={[styles.fieldValue, !selectedEmotion && { color: colors.textSecondary }]}>
              {selectedEmotion?.label || "Chọn cảm xúc"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
        <View style={styles.divider} />

        <View style={styles.fieldRow}>
          <View style={styles.fieldIcon}>
            <Ionicons name="document-text-outline" size={18} color={colors.primary} />
          </View>
          <TextInput
            style={styles.noteInput}
            placeholder="Thêm ghi chú..."
            placeholderTextColor={colors.textSecondary}
            value={note}
            onChangeText={setNote}
          />
        </View>
      </View>

      <View style={styles.numpad}>
        {PAD_KEYS.map((key) => (
          <TouchableOpacity key={key} style={styles.padKey} onPress={() => handlePad(key)} activeOpacity={0.6}>
            <Text style={styles.padKeyText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, status === "pending" && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={status === "pending"}
      >
        <LinearGradient
          colors={type === "income" ? gradients.forest : [colors.clay, colors.expense]}
          style={styles.saveGradient}
        >
          <Text style={styles.saveBtnText}>
            {status === "pending" ? "Đang lưu..." : editData ? "Lưu thay đổi" : "Lưu giao dịch"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <BottomSheet visible={showCatPicker} onClose={() => setShowCatPicker(false)} title="Chọn hạng mục" snapHeight={480}>
        <CategoryPicker
          selected={categoryId || category}
          type={type}
          onSelect={(selected) => {
            setCategory(selected.name);
            setCategoryId(selected.id);
            setShowCatPicker(false);
          }}
        />
      </BottomSheet>

      <BottomSheet visible={showWalletPick} onClose={() => setShowWalletPick(false)} title="Chọn ví tiền" snapHeight={360}>
        <View style={{ paddingTop: spacing.sm }}>
          {wallets.map((w) => (
            <TouchableOpacity
              key={w.id}
              onPress={() => {
                setWalletId(w.id);
                setShowWalletPick(false);
              }}
            >
              <WalletCard
                name={w.name}
                balance={w.balance}
                icon={w.icon}
                color={w.color}
                isDefault={w.isDefault}
                selected={walletId === w.id}
              />
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>

      <BottomSheet visible={showEmotionPicker} onClose={() => setShowEmotionPicker(false)} title="Cảm xúc khi giao dịch" snapHeight={360}>
        <View style={styles.emotionGrid}>
          {emotions.map((emotion) => {
            const active = emotion.id === emotionId;
            return (
              <TouchableOpacity
                key={emotion.id}
                style={[styles.emotionItem, active && styles.emotionItemActive]}
                onPress={() => {
                  setEmotionId(emotion.id);
                  setShowEmotionPicker(false);
                }}
              >
                <View style={[styles.emotionIcon, { backgroundColor: `${emotion.color}22` }]}>
                  <Ionicons name={emotion.icon} size={22} color={emotion.color} />
                </View>
                <Text style={[styles.emotionLabel, active && styles.emotionLabelActive]}>{emotion.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.md },
  closeBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: colors.border, ...shadows.soft },
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
  fieldIcon: { width: 34, height: 34, borderRadius: 13, backgroundColor: colors.surfaceAlt, justifyContent: "center", alignItems: "center", marginRight: spacing.sm },
  fieldLabel: { fontSize: typography.fontSize.xs, color: colors.textSecondary, fontFamily: typography.family.medium },
  fieldValue: { fontSize: typography.fontSize.md, fontFamily: typography.family.semiBold, color: colors.textPrimary, marginTop: 2 },
  noteInput: { flex: 1, fontSize: typography.fontSize.md, color: colors.textPrimary, paddingVertical: 0 },
  divider: { height: 1, backgroundColor: colors.divider, marginLeft: 46 },
  numpad: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: spacing.md, marginBottom: spacing.base },
  padKey: { width: "33.33%", paddingVertical: spacing.sm, alignItems: "center" },
  padKeyText: { fontSize: typography.fontSize.xl, fontFamily: typography.family.medium, color: colors.textPrimary },
  saveBtn: { marginHorizontal: spacing.md, marginBottom: spacing.lg, borderRadius: borderRadius.full, overflow: "hidden", ...shadows.lifted },
  saveGradient: { paddingVertical: spacing.base, paddingHorizontal: spacing.md, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: typography.fontSize.base, fontFamily: typography.family.semiBold },
  emotionGrid: { flexDirection: "row", flexWrap: "wrap", paddingVertical: spacing.sm },
  emotionItem: { width: "33.33%", alignItems: "center", paddingVertical: spacing.base, borderRadius: borderRadius.lg },
  emotionItemActive: { backgroundColor: colors.surfaceAlt },
  emotionIcon: { width: 50, height: 50, borderRadius: borderRadius.lg, justifyContent: "center", alignItems: "center", marginBottom: spacing.xs },
  emotionLabel: { fontSize: typography.fontSize.xs, color: colors.textSecondary, fontFamily: typography.family.medium },
  emotionLabelActive: { color: colors.primary, fontFamily: typography.family.semiBold },
});
