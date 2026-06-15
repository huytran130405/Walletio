import React, { useEffect, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchTransactions, selectMonthlySummary, selectExpenseByCategory } from "../../store/slices/transactionSlice";
import { fetchBudgets, selectTotalBudgetLimit }      from "../../store/slices/budgetSlice";
import CircularProgress from "../../components/common/CircularProgress";
import CategoryRow      from "../../components/common/CategoryRow";
import { colors }     from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing }    from "../../theme/spacing";

export default function Dashboard({ navigation }) {
  const dispatch = useDispatch();
  const user     = useSelector((s) => s.auth.user);

  // Tháng hiện tại
  const now   = new Date();
  const month = now.getMonth() + 1;
  const year  = now.getFullYear();

  // Redux selectors
  const summary    = useSelector((s) => selectMonthlySummary(s, month, year));
  const totalLimit = useSelector((s) => selectTotalBudgetLimit(s));
  const catExpense = useSelector((s) => selectExpenseByCategory(s, month, year));
  const state      = useSelector((s) => s);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBudgets());
  }, []);

  // Tính greeting theo giờ
  const greeting = useMemo(() => {
    const h = now.getHours();
    if (h < 12) return "Chào buổi sáng,";
    if (h < 18) return "Chào buổi chiều,";
    return "Chào buổi tối,";
  }, []);

  const totalBudget = totalLimit;
  const totalSpent  = summary.expense;
  const remaining   = totalBudget - totalSpent;
  const progress    = totalBudget > 0 ? totalSpent / totalBudget : 0;

  // Top 3 hạng mục chi tiêu nhiều nhất
  const topCategories = [...catExpense]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // Budget theo category từ Redux
  const budgets = useSelector((s) => s.budget.budgets);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.username}>{user?.name ?? "Người dùng"} 👋</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate("AccountSettings")}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* ── Budget card ── */}
        <View style={styles.card}>
          {/* Ngân sách tháng */}
          <View style={styles.monthRow}>
            <Text style={styles.monthLabel}>Ngân sách tháng {month}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("BudgetPlanning")}>
              <Text style={styles.moreBtn}>···</Text>
            </TouchableOpacity>
          </View>

          {/* Circular + stats */}
          <View style={styles.circleRow}>
            <CircularProgress
              size={130}
              strokeWidth={13}
              progress={1 - Math.min(progress, 1)}
              centerLabel="Còn lại"
              centerValue={
                remaining >= 0
                  ? `${(remaining / 1000000).toFixed(1)}tr₫`
                  : `-${(Math.abs(remaining) / 1000000).toFixed(1)}tr₫`
              }
              color={remaining >= 0 ? colors.primary : colors.expense}
              trackColor="#DCFCE7"
            />
            <View style={styles.statsCol}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Tổng ngân sách</Text>
                <Text style={styles.statValue}>
                  {(totalBudget / 1000).toLocaleString("vi-VN")}₫
                </Text>
              </View>
              <View style={[styles.statItem, { marginTop: spacing.md }]}>
                <Text style={styles.statLabel}>Đã chi tiêu</Text>
                <Text style={[styles.statValue, { color: colors.expense }]}>
                  {(totalSpent / 1000).toLocaleString("vi-VN")}₫
                </Text>
              </View>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#FEF2F2" }]}
              onPress={() => navigation.navigate("CreateTransaction", { initialType: "expense" })}
            >
              <Text style={styles.actionEmoji}>➖</Text>
              <Text style={[styles.actionLabel, { color: colors.expense }]}>Chi phí</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#ECFDF5" }]}
              onPress={() => navigation.navigate("CreateTransaction", { initialType: "income" })}
            >
              <Text style={styles.actionEmoji}>➕</Text>
              <Text style={[styles.actionLabel, { color: colors.income }]}>Thu nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#EFF6FF" }]}
              onPress={() => navigation.navigate("TransferMoney")}
            >
              <Text style={styles.actionEmoji}>↔️</Text>
              <Text style={[styles.actionLabel, { color: "#3B82F6" }]}>Chuyển tiền</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Chi tiêu theo hạng mục ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chi tiêu theo hạng mục</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.catCard}>
            {topCategories.length > 0 ? (
              topCategories.map((cat, i) => {
                const budget = budgets.find((b) => b.category === cat.name);
                return (
                  <CategoryRow
                    key={i}
                    name={cat.name}
                    amount={cat.amount}
                    budget={budget?.limit ?? 0}
                    showBar={false}
                    amountColor={colors.expense}
                  />
                );
              })
            ) : (
              <Text style={styles.emptyText}>Chưa có giao dịch trong tháng này</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: "#F4F6F9" },
  container:    { flex: 1, backgroundColor: "#F4F6F9" },
  // Header
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: spacing.base, paddingTop: spacing.lg, paddingBottom: spacing.md },
  greeting:     { fontSize: typography.fontSize.sm, color: colors.textSecondary },
  username:     { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  settingsBtn:  { width: 36, height: 36, borderRadius: 18, backgroundColor: "#EFEFEF", justifyContent: "center", alignItems: "center" },
  settingsIcon: { fontSize: 16 },
  // Card
  card:         { marginHorizontal: spacing.base, backgroundColor: "#FFFFFF", borderRadius: 20, padding: spacing.base, marginBottom: spacing.base, borderWidth: 1, borderColor: "#F0F0F0", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  monthRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  monthLabel:   { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semiBold, color: colors.textPrimary },
  moreBtn:      { fontSize: 20, color: colors.textSecondary, letterSpacing: 2 },
  // Circle row
  circleRow:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.lg },
  statsCol:     { flex: 1, paddingLeft: spacing.lg },
  statItem:     {},
  statLabel:    { fontSize: typography.fontSize.xs, color: colors.textSecondary },
  statValue:    { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginTop: 2 },
  // Actions
  actions:      { flexDirection: "row", gap: spacing.sm },
  actionBtn:    { flex: 1, alignItems: "center", paddingVertical: spacing.sm, borderRadius: 12 },
  actionEmoji:  { fontSize: 18, marginBottom: 4 },
  actionLabel:  { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium },
  // Section
  section:      { paddingHorizontal: spacing.base, marginBottom: spacing.base },
  sectionHeader:{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
  sectionTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semiBold, color: colors.textPrimary },
  seeAll:       { fontSize: typography.fontSize.sm, color: colors.primary },
  catCard:      { backgroundColor: "#FFFFFF", borderRadius: 16, padding: spacing.md },
  emptyText:    { textAlign: "center", color: colors.textSecondary, paddingVertical: spacing.md },
});
