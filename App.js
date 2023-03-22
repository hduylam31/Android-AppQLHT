import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthStack from "./navigation/authNavigator";
import Login_Moodle from "./screens/Login_Moodle";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TailwindProvider>
      <NavigationContainer>
        {/* <AuthStack /> */}
        <Stack.Navigator>
          <Stack.Screen name="Schecule" component={Login_Moodle} />
        </Stack.Navigator>
      </NavigationContainer>
    </TailwindProvider>
  );
}
