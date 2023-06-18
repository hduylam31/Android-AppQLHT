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
import CalendarService from "../../service/CalendarService";

const CalendarExtendTurnOnOffNoti = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  useEffect(() => {
    const loadData = async () => {
      const isNoti = await CalendarService.isNoti();
      console.log("isNoti: ", isNoti);
      setIsNotifiedMoodle(isNoti.isMoodleCalendarNotified);
      setIsNotifiedInv(isNoti.isUserCalendarNotified);
    };
    loadData();
  }, []);

  const [isNotifiedMoodle, setIsNotifiedMoodle] = useState(false);
  const [isNotifiedInv, setIsNotifiedInv] = useState(false);

  function processNotiMoodle(value) {
    setIsNotifiedMoodle(value);
    console.log("isNotifiedMoodle: ", value);
    if (value == true) {
      CalendarService.turnOnCalendarNotification(true);
    } else {
      CalendarService.turnOffCalendarNotification(true);
    }
  }

  function processNotiUser(value) {
    setIsNotifiedInv(value);
    console.log("isNotifiedUser: ", value);
    if (value == true) {
      CalendarService.turnOnCalendarNotification(false);
    } else {
      CalendarService.turnOffCalendarNotification(false);
    }
  }

  return (
    <TouchableWithoutFeedback>
      {/* Thanh bar tiêu đề và điều hướng */}
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-14 flex-row justify-between items-center px-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl font-medium">
              Bật/Tắt thông báo
            </Text>
          </View>
          <View className="w-7 h-7"></View>

          {/* Phần tiêu đề */}
        </View>
        <ScrollView className=" bg-[#F1F5F9]">
          <View className="w-full mt-5 h-24 bg-white rounded-lg">
            <TouchableOpacity
              //   onPress={() => {
              //     navigation.navigate("CalendarExtendTimeNoti");
              //   }}
              className="flex-row px-5 justify-between items-center border-b-2 border-b-[#f3f2f4]"
            >
              <Text className="text-base">Thông báo sự kiện moodle</Text>
              <Switch
                trackColor={{ false: "grey", true: "#3A4666" }}
                thumbColor={isNotifiedMoodle ? "#f4f3f4" : "#f4f3f4"}
                value={isNotifiedMoodle}
                onValueChange={(newValue) => processNotiMoodle(newValue)}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              //   onPress={() => {
              //     navigation.navigate("CalendarExtendTurnOnOffNoti");
              //   }}
              className="flex-row px-5 justify-between items-center"
            >
              <Text className="text-base">Thông báo sự kiện cá nhân hóa</Text>
              <Switch
                trackColor={{ false: "grey", true: "#3A4666" }}
                thumbColor={isNotifiedInv ? "#f4f3f4" : "#f4f3f4"}
                value={isNotifiedInv}
                onValueChange={(newValue) => processNotiUser(newValue)}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity
          className="w-[90%] h-10 absolute bottom-14 ml-[5%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <Text className="text-white text-center font-bold text-base">
            Lưu
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CalendarExtendTurnOnOffNoti;
