import React, { useEffect, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchBudgets, deleteBudget, selectBudgetSummary } from "../../store/slices/budgetSlice";
import CategoryRow from "../../components/common/CategoryRow";
import { colors }     from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing }    from "../../theme/spacing";

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
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Phân bổ ngân sách</Text>
          <TouchableOpacity onPress={() => navigation.navigate("AddBudget")}>
            <Text style={styles.addBtn}>+ Thêm</Text>
          </TouchableOpacity>
        </View>

        {/* Overview card */}
        <View style={styles.overviewCard}>
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
        </View>

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
  safe:          { flex: 1, backgroundColor: "#F4F6F9" },
  container:     { flex: 1 },
  header:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.base, paddingTop: spacing.lg, paddingBottom: spacing.md },
  backBtn:       { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F0F0F0", justifyContent: "center", alignItems: "center" },
  backIcon:      { fontSize: 18 },
  headerTitle:   { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  addBtn:        { fontSize: typography.fontSize.md, color: colors.primary, fontWeight: typography.fontWeight.semiBold },
  overviewCard:  { marginHorizontal: spacing.base, backgroundColor: "#fff", borderRadius: 16, padding: spacing.base, marginBottom: spacing.md },
  overviewRow:   { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md },
  overviewLabel: { fontSize: typography.fontSize.xs, color: colors.textSecondary },
  overviewAmount:{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginTop: 2 },
  overallBarTrack:{ height: 8, backgroundColor: "#F3F4F6", borderRadius: 99, overflow: "hidden", marginBottom: 6 },
  overallBar:    { height: "100%", borderRadius: 99 },
  overallPct:    { fontSize: typography.fontSize.xs, color: colors.textSecondary },
  titleBlock:    { paddingHorizontal: spacing.base, marginBottom: spacing.sm },
  subtitle:      { fontSize: typography.fontSize.sm, color: colors.textSecondary },
  section:       { paddingHorizontal: spacing.base, marginBottom: spacing.md },
  sectionLabel:  { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semiBold, color: colors.textPrimary, marginBottom: spacing.sm },
  sectionCard:   { backgroundColor: "#FFFFFF", borderRadius: 14, paddingHorizontal: spacing.md },
  divider:       { height: 1, backgroundColor: "#F3F4F6" },
  addBudgetBtn:  { marginHorizontal: spacing.base, padding: spacing.md, borderRadius: 14, borderWidth: 1.5, borderColor: colors.primary, borderStyle: "dashed", alignItems: "center", marginTop: spacing.sm },
  addBudgetText: { color: colors.primary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semiBold },
  hint:          { textAlign: "center", fontSize: typography.fontSize.xs, color: colors.textSecondary, marginTop: spacing.md },
});
