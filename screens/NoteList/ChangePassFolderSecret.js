import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Animatable from "react-native-animatable";
import NoteService from "../../service/NoteService";

const ChangePassFolderSecret = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  async function changePassFolderSecret(){
    console.log("haha");
    if(newPassword != "" && newPassword == repassword){
      const status = await NoteService.changePassword(oldPassword, newPassword);
      if(status == ""){
        Alert.alert("Lỗi", "Mật khẩu cũ không chính xác");  
      } else{
        Alert.alert("Thông báo", "Thay đổi mật khẩu thành công");
        await new Promise(r => setTimeout(r, 1000));
        navigation.navigate("UnlockFolderSecret", {secretPassword: status}); 
      }
    }
    
  }

  return (
    <SafeAreaView className="bg-[#3A4666] flex-1">
      <View className="p-4 flex-row justify-between items-center mt-10">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={32} color="white" />
        </TouchableOpacity>
        <MaterialCommunityIcons name="folder-lock" size={32} color="white" />
        <View className="h-8 w-8"></View>
      </View>
      <View className="justify-center items-center px-4">
        <Text className="text-[#FFFFFF] text-3xl font-bold">
          Thư mục bảo mật
        </Text>
        <Text className="text-[#FFFFFF] text-base font-light mt-[25%]">
          Thay đổi mật mã
        </Text>
        <View className="w-full h-60 bg-white mt-[5%] rounded-2xl p-4">
          <TextInput
            placeholder="Mật mã cũ"
            autoCapitalize="none"
            value={oldPassword}
            onChangeText={(password) => setOldPassword(password)}
            className=" bg-white pl-4 border-b-[#9A999B] border-b-2 flex-1"
          ></TextInput>
          <TextInput
            placeholder="Mật mã mới"
            autoCapitalize="none"
            value={newPassword}
            onChangeText={(password) => setNewPassword(password)}
            className=" bg-white pl-4 border-b-[#9A999B] border-b-2 flex-1"
          ></TextInput>
          <TextInput
            placeholder="Nhập lại mật mã mới"
            autoCapitalize="none"
            value={repassword}
            onChangeText={(repassword) => setRepassword(repassword)}
            className=" bg-white pl-4 border-b-[#9A999B] border-b-2 mb-8 flex-1"
          ></TextInput>
        </View>
      </View>

      <TouchableOpacity
          onPress={changePassFolderSecret}
        className="mt-10"
      >
        <Animatable.View
          easing="ease-in-out"
          iterationCount={"infinite"}
          className="w-[80%] h-[50px] items-center justify-center bg-[#FE8668] self-center rounded-2xl mt-[2%]"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text className="text-[#3A4666] text-base font-bold">Lưu</Text>
        </Animatable.View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChangePassFolderSecret;
