import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthStack from "./navigation/authNavigator";
import Done_Moodle from "./screens/Authentication/DoneMoodle";
import CalendarMain from "./screens/Calendar/CalendarMain";
import Login_Moodle from "./screens/Authentication/Login_Moodle";
import Login from "./screens/Authentication/Login";
import ScheduleMain from "./screens/Schedule/ScheduleMain";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TailwindProvider>
      <NavigationContainer>
        <AuthStack />
        {/* <Stack.Navigator>
          <Stack.Screen name="Schecule" component={CalendarMain} />
        </Stack.Navigator> */}
      </NavigationContainer>
    </TailwindProvider>
  );
}
