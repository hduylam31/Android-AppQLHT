import React, { useEffect, useLayoutEffect, useState } from "react";
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
import { auth } from "../../firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AccountService from "../../service/AccountService";

const Account_EditInfor = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const name = route.params.name;

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadData = () => {
      setUserName(name);
      setEmail(auth.currentUser.email);
    };
    loadData();
  }, []);

  const handleSaveAccountInfo = async () => {
    if (userName === "") {
      Alert.alert("Lưu không thành công", "Vui lòng nhập họ và tên");
    } else {
      try {
        await AccountService.saveUserInfo(userName);
        navigation.navigate("BottomBar", {
          screen: "Tài khoản",
          params: {
            screenAccount: "EditToMain",
          },
        });
      } catch (error) {}
    }
  };

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
        <View className="bg-[#3A4666] h-15">
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView className="bg-[#F1F5F9]">
          <View className="px-5 pt-[4%] space-y-2 mt-14">
            <Text className="text-base">Họ và tên</Text>
            <TextInput
              placeholder="Họ và tên"
              defaultValue={userName}
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
              editable={false}
            ></TextInput>
          </View>
          {/* Button thêm */}
          <TouchableOpacity
            onPress={handleSaveAccountInfo}
            className="bg-[#3A4666] rounded-2xl flex items-center justify-center mt-[440px] mb-6 h-10 w-[90%] ml-[5%]"
            style={{
              shadowColor: "#000000",
              shadowOffset: { width: 10, height: 10 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <Text className="text-white text-center font-bold text-base">
              Lưu
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <View className="w-24 h-24 bg-[#A4AAB8] rounded-full justify-center items-center absolute top-5 left-[38%]">
          <MaterialCommunityIcons name="account" size={80} color="white" />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Account_EditInfor;
