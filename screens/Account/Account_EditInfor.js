import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Account_EditInfor = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handlePress = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-[10%]">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View className="mt-5 ml-[3%] w-10 h-10">
              <MaterialCommunityIcons
                name="arrow-left"
                size={40}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView className="bg-[#F1F5F9]">
          <View className="px-5 pt-[4%] space-y-2 mt-14">
            <Text className="text-base">Tiêu đề</Text>
            <TextInput
              placeholder="Họ và tên"
              placeholderTextColor="#000000"
              className="w-[100%] h-12 bg-[#FFFFFF] pl-4 rounded-lg text-base resize-none"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
              value={userName}
              onChangeText={(text) => setUserName(text)}
            ></TextInput>
            <Text className="text-base">Email</Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#000000"
              className="w-[100%] h-12 bg-[#FFFFFF] pl-4 rounded-lg text-base resize-none"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
              value={email}
              onChangeText={(text) => setEmail(text)}
            ></TextInput>
          </View>
          {/* Button thêm */}
          <TouchableOpacity
            // onPress={handleAddingTodolist}
            className="bg-[#3A4666] rounded-2xl flex items-center justify-center mt-96 mb-6 h-10 w-[90%] ml-[5%]"
            style={{
              shadowColor: "#000000",
              shadowOffset: { width: 10, height: 10 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <Text className="text-white text-center font-bold text-xl">
              Lưu
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <View className="w-24 h-24 bg-[#A4AAB8] rounded-full justify-center items-center absolute top-14 left-[38%] right-0 bottom-0">
          <MaterialCommunityIcons name="account" size={80} color="white" />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Account_EditInfor;