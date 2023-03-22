import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthStack from "./navigation/authNavigator";
import Calendar from "./screens/Calender/CalendarMain";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TailwindProvider>
      <NavigationContainer>
        <AuthStack />
        {/* <Stack.Navigator>
          <Stack.Screen name="Schecule" component={Calendar} />
        </Stack.Navigator> */}
      </NavigationContainer>
    </TailwindProvider>
  );
}
