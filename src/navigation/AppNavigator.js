import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import TabNavigator from "./TabNavigator";

// Auth screens
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";
import ForgotPassword from "../screens/Auth/ForgotPassword";

// Push screens
import Transactions from "../screens/Transactions";
import BudgetPlanning from "../screens/BudgetPlanning";
import TransactionDetail from "../screens/Transactions/TransactionDetail";
import WalletDetail from "../screens/MyWallets/WalletDetail";
import TransferHistory from "../screens/MyWallets/TransferHistory";
import ExpenseHistory from "../screens/MyWallets/ExpenseHistory";
import EditProfile from "../screens/AccountSettings/EditProfile";

// Modal screens
import AddWalletModal from "../screens/MyWallets/AddWalletModal";
import EditWalletModal from "../screens/MyWallets/EditWalletModal";
import TransferMoneyModal from "../screens/MyWallets/TransferMoneyModal";
import AddBudgetModal from "../screens/BudgetPlanning/AddBudgetModal";
import EditBudgetModal from "../screens/BudgetPlanning/EditBudgetModal";
import CreateTransaction from "../screens/CreateTransaction";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="BudgetPlanning" component={BudgetPlanning} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetail} />
      <Stack.Screen name="WalletDetail" component={WalletDetail} />
      <Stack.Screen name="TransferHistory" component={TransferHistory} />
      <Stack.Screen name="ExpenseHistory" component={ExpenseHistory} />
      <Stack.Screen name="EditProfile" component={EditProfile} />

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
        name="EditWallet"
        component={EditWalletModal}
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
