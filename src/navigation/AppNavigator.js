import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator         from "./TabNavigator";

// Push screens
import Transactions         from "../screens/Transactions";
import BudgetPlanning       from "../screens/BudgetPlanning";
import TransactionDetail    from "../screens/Transactions/TransactionDetail";

// Modal screens
import AddWalletModal       from "../screens/MyWallets/AddWalletModal";
import TransferMoneyModal   from "../screens/MyWallets/TransferMoneyModal";
import AddBudgetModal       from "../screens/BudgetPlanning/AddBudgetModal";
import EditBudgetModal      from "../screens/BudgetPlanning/EditBudgetModal";
import CreateTransaction    from "../screens/CreateTransaction";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Root — tabs */}
      <Stack.Screen name="MainTabs"           component={TabNavigator} />

      {/* ── Push screens ── */}
      <Stack.Screen name="Transactions"       component={Transactions} />
      <Stack.Screen name="BudgetPlanning"     component={BudgetPlanning} />
      <Stack.Screen name="TransactionDetail"  component={TransactionDetail} />

      {/* ── Modal screens ── */}
      <Stack.Screen
        name="CreateTransaction"
        component={CreateTransaction}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="AddWallet"
        component={AddWalletModal}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="TransferMoney"
        component={TransferMoneyModal}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="AddBudget"
        component={AddBudgetModal}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="EditBudget"
        component={EditBudgetModal}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
