import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteWalletLocal,
  selectTotalBalance,
} from "../../store/slices/walletSlice";
import WalletHeroCard from "./components/WalletHeroCard";
import WalletQuickActions from "./components/WalletQuickActions";
import PaymentWalletSection from "./components/PaymentWalletSection";
import ExpenseHistorySection from "./components/ExpenseHistorySection";
import { enrichExpenses } from "./utils/expenseHistory";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

export default function MyWallets({ navigation }) {
  const dispatch = useDispatch();
  const wallets = useSelector((state) => state.wallets.wallets);
  const transactions = useSelector((state) => state.transactions.transactions);
  const categories = useSelector((state) => state.categories.categories);
  const emotions = useSelector((state) => state.emotions.emotions);
  const totalBalance = useSelector((state) => selectTotalBalance(state));

  const expenseHistory = useMemo(
    () => enrichExpenses({ transactions, wallets, categories, emotions }),
    [categories, emotions, transactions, wallets],
  );

  const trackedExpense = expenseHistory.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );
  const paymentBalance = wallets.reduce(
    (sum, wallet) => sum + wallet.balance,
    0,
  );

  const handleDelete = (wallet) => {
    Alert.alert("Xoá ví", `Bạn có chắc muốn xoá ví "${wallet.name}"?`, [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: () => dispatch(deleteWalletLocal(wallet.id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Animated.View entering={FadeInUp.duration(500)}>
          <WalletHeroCard
            totalBalance={totalBalance}
            paymentBalance={paymentBalance}
            trackedExpense={trackedExpense}
          />
        </Animated.View>

        <WalletQuickActions navigation={navigation} />

        <PaymentWalletSection
          wallets={wallets}
          onAddWallet={() => navigation.navigate("AddWallet")}
          onOpenWallet={(wallet) =>
            navigation.navigate("WalletDetail", { walletId: wallet.id })
          }
          onDeleteWallet={handleDelete}
        />

        <ExpenseHistorySection
          expenses={expenseHistory.slice(0, 5)}
          onOpenAll={() => navigation.navigate("ExpenseHistory")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingTop: spacing.lg,
    paddingBottom: 128,
  },
});
