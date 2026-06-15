import React, { useEffect, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSelector, useDispatch } from "react-redux";
import { fetchBudgets, deleteBudget, selectBudgetSummary } from "../../store/slices/budgetSlice";
import CategoryRow from "../../components/common/CategoryRow";
import { colors, gradients, shadows } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

export default function BudgetPlanning({ navigation }) {
  const dispatch = useDispatch();

  const now   = new Date();
  const month = now.getMonth() + 1;
  const year  = now.getFullYear();

  const budgetSummary = useSelector((s) => selectBudgetSummary(s, month, year));

  useEffect(() => {
    dispatch(fetchBudgets());
  }, []);

  const totalLimit = budgetSummary.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgetSummary.reduce((s, b) => s + b.spent, 0);
  const overallPct = totalLimit > 0 ? totalSpent / totalLimit : 0;

  // Group by groupTitle
  const sections = useMemo(() => {
    const groups = {};
    budgetSummary.forEach((b) => {
      const key = b.groupTitle ?? "Khác";
      if (!groups[key]) groups[key] = [];
      groups[key].push(b);
    });
    return Object.entries(groups).map(([title, items]) => ({ title, items }));
  }, [budgetSummary]);

  const handleDelete = (budget) => {
    Alert.alert(
      "Xoá ngân sách",
      `Xoá ngân sách "${budget.category}"?`,
      [
        { text: "Huỷ", style: "cancel" },
        { text: "Xoá", style: "destructive", onPress: () => dispatch(deleteBudget(budget.id)) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(420)} style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Phân bổ ngân sách</Text>
          <TouchableOpacity onPress={() => navigation.navigate("AddBudget")}>
            <Text style={styles.addBtn}>+ Thêm</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Overview card */}
        <Animated.View entering={FadeInUp.duration(520).springify()} style={styles.overviewCard}>
          <LinearGradient colors={gradients.sky} style={styles.overviewGradient}>
          <View style={styles.overviewRow}>
            <View>
              <Text style={styles.overviewLabel}>Tổng hạn mức</Text>
              <Text style={styles.overviewAmount}>{totalLimit.toLocaleString("vi-VN")}₫</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.overviewLabel}>Đã chi</Text>
              <Text style={[styles.overviewAmount, { color: colors.expense }]}>
                {totalSpent.toLocaleString("vi-VN")}₫
              </Text>
            </View>
          </View>
          {/* Overall progress bar */}
          <View style={styles.overallBarTrack}>
            <View
              style={[
                styles.overallBar,
                {
                  width: `${Math.min(overallPct * 100, 100)}%`,
                  backgroundColor: overallPct > 0.9 ? colors.expense : colors.primary,
                },
              ]}
            />
          </View>
          <Text style={styles.overallPct}>{Math.round(overallPct * 100)}% đã sử dụng</Text>
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.subtitle}>Tháng {month}/{year}</Text>
        </View>

        {/* Sections */}
        {sections.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, ii) => (
                <View key={item.id ?? ii}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("EditBudget", { budget: item })}
                    onLongPress={() => handleDelete(item)}
                    activeOpacity={0.7}
                  >
                    <CategoryRow
                      name={item.category}
                      amount={item.spent}
                      budget={item.limit}
                      showBar={true}
                      barColor={item.spent > item.limit ? colors.expense : item.color ?? colors.primary}
                    />
                  </TouchableOpacity>
                  {ii < section.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Add button */}
        <TouchableOpacity style={styles.addBudgetBtn} onPress={() => navigation.navigate("AddBudget")}>
          <Text style={styles.addBudgetText}>+ Thêm hạng mục ngân sách</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>💡 Nhấn giữ để xoá · Nhấn để chỉnh sửa</Text>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container:     { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.md },
  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center", ...shadows.soft },
  backIcon: { fontSize: 18, color: colors.textPrimary },
  headerTitle: { fontSize: typography.fontSize.lg, fontFamily: typography.family.bold, color: colors.textPrimary },
  addBtn: { fontSize: typography.fontSize.md, color: colors.primary, fontFamily: typography.family.semiBold },
  overviewCard: { marginHorizontal: spacing.md, borderRadius: borderRadius.xxl, marginBottom: spacing.lg, overflow: "hidden", borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  overviewGradient: { padding: spacing.lg },
  overviewRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md },
  overviewLabel: { fontSize: typography.fontSize.xs, color: colors.textSecondary, fontFamily: typography.family.medium },
  overviewAmount: { fontSize: typography.fontSize.lg, fontFamily: typography.family.bold, color: colors.textPrimary, marginTop: 4 },
  overallBarTrack:{ height: 10, backgroundColor: "rgba(47,125,90,0.12)", borderRadius: 99, overflow: "hidden", marginBottom: spacing.xs },
  overallBar:    { height: "100%", borderRadius: 99 },
  overallPct: { fontSize: typography.fontSize.xs, color: colors.textSecondary, fontFamily: typography.family.medium },
  titleBlock: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  subtitle: { fontSize: typography.fontSize.sm, color: colors.textSecondary, fontFamily: typography.family.medium },
  section: { paddingHorizontal: spacing.md, marginBottom: spacing.lg },
  sectionLabel: { fontSize: typography.fontSize.md, fontFamily: typography.family.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  sectionCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, paddingHorizontal: spacing.base, borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  divider: { height: 1, backgroundColor: colors.divider },
  addBudgetBtn: { marginHorizontal: spacing.md, marginBottom: spacing.lg, borderWidth: 1.5, borderColor: colors.primaryLight, borderStyle: "dashed", borderRadius: borderRadius.full, paddingVertical: spacing.base, paddingHorizontal: spacing.md, alignItems: "center", marginTop: spacing.sm, backgroundColor: "rgba(255,253,247,0.7)" },
  addBudgetText: { color: colors.primary, fontSize: typography.fontSize.md, fontFamily: typography.family.semiBold },
  hint:          { textAlign: "center", fontSize: typography.fontSize.xs, color: colors.textSecondary, marginTop: spacing.base },
});
