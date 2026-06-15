import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, gradients, shadows } from "../theme/colors";
import { typography } from "../theme/typography";

// Screens
import Dashboard         from "../screens/Dashboard";
import BudgetPlanning    from "../screens/BudgetPlanning";
import CreateTransaction from "../screens/CreateTransaction";
import Statistics        from "../screens/Statistics";
import AccountSettings   from "../screens/AccountSettings";

const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  { name: "Dashboard",      label: "Ngân sách", emoji: "📊" },
  { name: "MyWallets",      label: "Ví tiền",   emoji: "👛" },
  { name: "CreateTransaction", label: "",        emoji: "➕", isFAB: true },
  { name: "Statistics",    label: "Thống kê",   emoji: "📈" },
  { name: "AccountSettings", label: "Cá nhân",  emoji: "👤" },
];

// We import MyWallets for the Ví tiền tab
import MyWallets from "../screens/MyWallets";

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom || 8 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const cfg = TAB_CONFIG[index];

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        if (cfg?.isFAB) {
          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.fabWrap}>
              <LinearGradient colors={gradients.forest} style={styles.fab}>
                <Text style={styles.fabIcon}>＋</Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem} activeOpacity={0.7}>
            <Text style={[styles.tabEmoji, isFocused && styles.tabEmojiActive]}>{cfg?.emoji}</Text>
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{cfg?.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard"         component={Dashboard} />
      <Tab.Screen name="MyWallets"         component={MyWallets} />
      <Tab.Screen name="CreateTransaction" component={CreateTransaction} />
      <Tab.Screen name="Statistics"        component={Statistics} />
      <Tab.Screen name="AccountSettings"   component={AccountSettings} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection:   "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop:      10,
    ...shadows.soft,
  },
  tabItem:        { flex: 1, alignItems: "center", justifyContent: "center", gap: 3 },
  tabEmoji:       { fontSize: 20, opacity: 0.4 },
  tabEmojiActive: { opacity: 1 },
  tabLabel:       { fontSize: typography.fontSize.xs, color: colors.textSecondary, fontFamily: typography.family.medium },
  tabLabelActive: { color: colors.primary },
  fabWrap:        { flex: 1, alignItems: "center", justifyContent: "center", marginTop: -18 },
  fab: {
    width:           52,
    height:          52,
    borderRadius:    26,
    justifyContent:  "center",
    alignItems:      "center",
    elevation:       6,
    ...shadows.lifted,
  },
  fabIcon: { fontSize: 26, color: "#FFFFFF", fontWeight: "300", marginTop: -2 },
});
