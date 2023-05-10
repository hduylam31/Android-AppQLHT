import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Switch,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useEffect } from "react";

const CalendarExtendTurnOnOffNoti = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const [isNotifiedMoodle, setIsNotifiedMoodle] = useState(true);
  const [isNotifiedInv, setIsNotifiedInv] = useState(true);

  useEffect(()=> {
    function func(){
      
    }
    func();
  }, [isNotifiedMoodle])

  return (
    <TouchableWithoutFeedback>
      {/* Thanh bar tiêu đề và điều hướng */}
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-15">
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={32}
                color="white"
              />
            </TouchableOpacity>
            <View>
              <Text className="text-white text-xl">Bật/Tắt thông báo</Text>
            </View>
            <View className="w-8 h-8"></View>

            {/* Phần tiêu đề */}
          </View>
        </View>
        <ScrollView className=" bg-[#F1F5F9]">
          <View className="w-full mt-5 h-24 bg-white rounded-lg">
            <TouchableOpacity
              //   onPress={() => {
              //     navigation.navigate("CalendarExtendTimeNoti");
              //   }}
              className="flex-row px-5 justify-between items-center border-b-2 border-b-[#f3f2f4]"
            >
              <Text>Thông báo sự kiện moodle</Text>
              <Switch
                trackColor={{ false: "grey", true: "#3A4666" }}
                thumbColor={isNotifiedMoodle ? "#f4f3f4" : "#f4f3f4"}
                value={isNotifiedMoodle}
                onValueChange={(newValue) => setIsNotifiedMoodle(newValue)}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              //   onPress={() => {
              //     navigation.navigate("CalendarExtendTurnOnOffNoti");
              //   }}
              className="flex-row px-5 justify-between items-center"
            >
              <Text>Thông báo sự kiện cá nhân hóa</Text>
              <Switch
                trackColor={{ false: "grey", true: "#3A4666" }}
                thumbColor={isNotifiedInv ? "#f4f3f4" : "#f4f3f4"}
                value={isNotifiedInv}
                onValueChange={(newValue) => setIsNotifiedInv(newValue)}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CalendarExtendTurnOnOffNoti;
