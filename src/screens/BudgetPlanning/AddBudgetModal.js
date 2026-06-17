import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import {
  createBudgetLocal,
  selectBudgetSummary,
  selectMonthlyBudget,
} from "../../store/slices/budgetSlice";
import Toast from "../../components/common/Toast";
import { colors, gradients, shadows } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

const COLORS = [
  colors.primary,
  colors.info,
  colors.accent,
  colors.clay,
  colors.expense,
  colors.secondaryDark,
  colors.earth,
];

const monthLabel = (month, year) => `Tháng ${month}/${year}`;
const money = (value = 0) => `${value.toLocaleString("vi-VN")}đ`;

export default function AddBudgetModal({ navigation, route }) {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.budget);
  const now = new Date();
  const month = route?.params?.month ?? now.getMonth() + 1;
  const year = route?.params?.year ?? now.getFullYear();

  const categories = useSelector((state) =>
    state.categories.categories.filter((category) => category.type === "expense"),
  );
  const groups = useSelector((state) => state.spendingGroups.groups);
  const monthlyBudget = useSelector((state) =>
    selectMonthlyBudget(state, month, year),
  );
  const budgetSummary = useSelector((state) =>
    selectBudgetSummary(state, month, year),
  );

  const initialCategoryId =
    route?.params?.categoryId ?? categories[0]?.id ?? "";
  const initialBudget = budgetSummary.find(
    (budget) => budget.categoryId === initialCategoryId,
  );

  const [selectedCategoryId, setSelectedCategoryId] =
    useState(initialCategoryId);
  const [limit, setLimit] = useState(
    initialBudget?.limit ? String(initialBudget.limit) : "",
  );
  const [color, setColor] = useState(
    initialBudget?.color ?? categories[0]?.color ?? COLORS[0],
  );
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId],
  );
  const selectedGroup = groups.find(
    (group) => group.id === selectedCategory?.groupId,
  );
  const allocated = budgetSummary.reduce(
    (sum, budget) => sum + (budget.limit ?? 0),
    0,
  );
  const remainingBefore = (monthlyBudget.amount ?? 0) - allocated;

  const selectCategory = (category) => {
    const existingBudget = budgetSummary.find(
      (budget) => budget.categoryId === category.id,
    );
    setSelectedCategoryId(category.id);
    setLimit(existingBudget?.limit ? String(existingBudget.limit) : "");
    setColor(existingBudget?.color ?? category.color ?? COLORS[0]);
  };

  const handleSave = () => {
    const amount = Number(limit);
    if (!selectedCategory) {
      Alert.alert("Thiếu danh mục", "Vui lòng chọn danh mục cần phân bổ.");
      return;
    }
    if (!amount || amount <= 0) {
      Alert.alert("Thiếu số tiền", "Vui lòng nhập số tiền phân bổ hợp lệ.");
      return;
    }

    dispatch(
      createBudgetLocal({
        month,
        year,
        categoryId: selectedCategory.id,
        category: selectedCategory.name,
        groupId: selectedCategory.groupId,
        groupTitle: selectedGroup?.title ?? "Khác",
        limit: amount,
        period: "monthly",
        color,
      }),
    );

    setToast({
      visible: true,
      message: `Đã phân bổ ${money(amount)} cho ${selectedCategory.name}.`,
      type: "success",
    });
    setTimeout(() => navigation.goBack(), 900);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.78}
        >
          <Ionicons name="close" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Giao việc cho tiền</Text>
        </View>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <LinearGradient colors={gradients.sunlight} style={styles.monthCard}>
          <View>
            <Text style={styles.monthCardLabel}>{monthLabel(month, year)}</Text>
            <Text style={styles.monthCardAmount}>
              Còn chưa phân bổ {money(Math.max(remainingBefore, 0))}
            </Text>
          </View>
          <Ionicons name="wallet-outline" size={24} color={colors.primaryDark} />
        </LinearGradient>

        <Text style={styles.label}>Nhóm danh mục</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => {
            const active = category.id === selectedCategoryId;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  active && {
                    borderColor: category.color,
                    backgroundColor: `${category.color}14`,
                  },
                ]}
                onPress={() => selectCategory(category)}
                activeOpacity={0.78}
              >
                <View
                  style={[
                    styles.categoryChipIcon,
                    { backgroundColor: `${category.color}18` },
                  ]}
                >
                  <Ionicons
                    name={category.icon}
                    size={17}
                    color={category.color}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryChipText,
                    active && { color: category.color },
                  ]}
                  numberOfLines={1}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Số tiền phân bổ</Text>
        <View style={styles.amountRow}>
          <TextInput
            style={styles.amountInput}
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            value={limit}
            onChangeText={setLimit}
            keyboardType="numeric"
          />
          <Text style={styles.amountCurrency}>VNĐ</Text>
        </View>

      </ScrollView>

      <TouchableOpacity
        style={[styles.saveBtn, status === "pending" && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={status === "pending"}
        activeOpacity={0.84}
      >
        <LinearGradient colors={gradients.forest} style={styles.saveGradient}>
          <Text style={styles.saveBtnText}>
            {status === "pending" ? "Đang lưu..." : "Lưu phân bổ"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.base,
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  headerCopy: { alignItems: "center" },
  kicker: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.family.medium,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.family.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  monthCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  monthCardLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.family.semiBold,
    color: colors.primaryDark,
  },
  monthCardAmount: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.family.bold,
    color: colors.textPrimary,
    marginTop: 4,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.family.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.base,
  },
  categoryChip: {
    width: "48.5%",
    minHeight: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
  },
  categoryChipIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.xs,
  },
  categoryChipText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.family.bold,
    color: colors.textPrimary,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingRight: spacing.base,
    marginBottom: spacing.base,
  },
  amountInput: {
    flex: 1,
    padding: spacing.base,
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary,
    fontFamily: typography.family.bold,
  },
  amountCurrency: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontFamily: typography.family.semiBold,
  },
  colorRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  colorDot: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: colors.surface,
    ...shadows.soft,
  },
  saveBtn: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.full,
    overflow: "hidden",
    ...shadows.lifted,
  },
  saveGradient: {
    paddingVertical: spacing.base,
    alignItems: "center",
  },
  saveBtnText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.base,
    fontFamily: typography.family.bold,
  },
});
