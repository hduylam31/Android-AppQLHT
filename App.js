import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthStack from "./navigation/authNavigator";
import ToDoList from "./screens/ToDoList";
import ToDoListScreen from "./screens/ToDoList";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TailwindProvider>
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    </TailwindProvider>
  );
}
