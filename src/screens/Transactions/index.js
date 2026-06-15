import React, { useState, useMemo } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { deleteTransaction } from "../../store/slices/transactionSlice";
import TransactionItem from "../../components/common/TransactionItem";
import { colors }     from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing }    from "../../theme/spacing";

const FILTERS = ["Tháng này", "Hàng tuần", "Tất cả"];

function groupByDate(transactions) {
  const groups = {};
  transactions.forEach((t) => {
    if (!groups[t.date]) groups[t.date] = [];
    groups[t.date].push(t);
  });
  // Chuyển thành mảng section
  return Object.entries(groups)
    .sort(([a], [b]) => {
      const parse = (s) => {
        const [d, m, y] = s.split("/");
        return new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).getTime();
      };
      return parse(b) - parse(a);
    })
    .map(([date, items]) => ({ date, items }));
}

export default function Transactions({ navigation }) {
  const dispatch      = useDispatch();
  const transactions  = useSelector((s) => s.transactions.transactions);

  const [filter, setFilter] = useState("Tháng này");
  const [search, setSearch] = useState("");

  const now = new Date();

  const filtered = useMemo(() => {
    let list = [...transactions];

    // Filter theo period
    if (filter === "Tháng này") {
      list = list.filter((t) => {
        const [, m, y] = t.date.split("/");
        return parseInt(m) === now.getMonth() + 1 && parseInt(y) === now.getFullYear();
      });
    } else if (filter === "Hàng tuần") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      list = list.filter((t) => {
        const [d, m, y] = t.date.split("/");
        const txDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        return txDate >= weekAgo;
      });
    }

    // Filter theo search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [transactions, filter, search]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  // Tổng chi/thu trong kết quả hiện tại
  const totalExpense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalIncome  = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

  const handleDelete = (tx) => {
    Alert.alert(
      "Xoá giao dịch",
      `Bạn có chắc muốn xoá "${tx.description}"?`,
      [
        { text: "Huỷ", style: "cancel" },
        { text: "Xoá", style: "destructive", onPress: () => dispatch(deleteTransaction(tx.id)) },
      ]
    );
  };

  const renderSection = ({ item: section }) => (
    <View style={styles.section}>
      <Text style={styles.dateHeader}>{section.date}</Text>
      <View style={styles.sectionCard}>
        {section.items.map((tx, i) => (
          <View key={tx.id}>
            <TouchableOpacity
              onPress={() => navigation.navigate("TransactionDetail", { transaction: tx })}
              onLongPress={() => handleDelete(tx)}
              activeOpacity={0.7}
            >
              <TransactionItem
                description={tx.description}
                category={tx.category}
                amount={tx.amount}
                type={tx.type}
                date=""
              />
            </TouchableOpacity>
            {i < section.items.length - 1 && <View style={styles.sep} />}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Lịch sử giao dịch</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderLeftColor: colors.income, borderLeftWidth: 3 }]}>
          <Text style={styles.sumLabel}>Thu</Text>
          <Text style={[styles.sumValue, { color: colors.income }]}>
            +{(totalIncome / 1000).toLocaleString("vi-VN")}₫
          </Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: colors.expense, borderLeftWidth: 3 }]}>
          <Text style={styles.sumLabel}>Chi</Text>
          <Text style={[styles.sumValue, { color: colors.expense }]}>
            -{(totalExpense / 1000).toLocaleString("vi-VN")}₫
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm giao dịch..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Text style={{ color: colors.textSecondary, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List grouped by date */}
      {grouped.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyText}>Không có giao dịch nào</Text>
        </View>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(item) => item.date}
          renderItem={renderSection}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: "#F4F6F9" },
  header:           { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.base, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  backBtn:          { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F0F0F0", justifyContent: "center", alignItems: "center" },
  backIcon:         { fontSize: 18 },
  title:            { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  summaryRow:       { flexDirection: "row", paddingHorizontal: spacing.base, gap: spacing.sm, marginBottom: spacing.sm },
  summaryCard:      { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: spacing.md },
  sumLabel:         { fontSize: typography.fontSize.xs, color: colors.textSecondary },
  sumValue:         { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, marginTop: 2 },
  searchRow:        { flexDirection: "row", alignItems: "center", marginHorizontal: spacing.base, backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  searchIcon:       { fontSize: 16, marginRight: spacing.sm },
  searchInput:      { flex: 1, fontSize: typography.fontSize.md, color: colors.textPrimary, paddingVertical: 0 },
  filterRow:        { flexDirection: "row", paddingHorizontal: spacing.base, gap: spacing.sm, marginBottom: spacing.md },
  filterBtn:        { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border },
  filterActive:     { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText:       { fontSize: typography.fontSize.sm, color: colors.textSecondary, fontWeight: typography.fontWeight.medium },
  filterTextActive: { color: "#fff" },
  section:          { paddingHorizontal: spacing.base, marginBottom: spacing.sm },
  dateHeader:       { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semiBold, color: colors.textSecondary, marginBottom: spacing.xs ?? 4 },
  sectionCard:      { backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: spacing.md, paddingVertical: spacing.xs ?? 4 },
  sep:              { height: 1, backgroundColor: "#F3F4F6" },
  empty:            { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 60 },
  emptyEmoji:       { fontSize: 48, marginBottom: spacing.md },
  emptyText:        { fontSize: typography.fontSize.md, color: colors.textSecondary },
});
