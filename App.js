import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthStack from "./navigation/authNavigator";
import Schedule from "./screens/Schedule";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TailwindProvider>
      <NavigationContainer>
        {/* <AuthStack /> */}
        <Stack.Navigator>
          <Stack.Screen name="Schecule" component={Schedule} />
        </Stack.Navigator>
      </NavigationContainer>
    </TailwindProvider>
  );
}
