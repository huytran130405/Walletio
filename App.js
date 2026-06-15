import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { mystore } from "./src/store/index";
import AppNavigator from "./src/navigation/AppNavigator";
import { colors } from "./src/theme/colors";

export default function App() {
  return (
    <Provider store={mystore}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={colors.primary} />
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
