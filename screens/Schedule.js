import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import records from "./Data.json";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const markedDates = {};

records.forEach((record) => {
  const date = moment(record.dateString).format("YYYY-MM-DD");
  markedDates[date] = {
    marked: true,
    dots: [{ color: "red" }, { color: "green" }],
    selected: true,
    selectedColor: "#DBECF6",
    selectedTextColor: "black",
  };
});

const Schedule = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  return (
    <TouchableWithoutFeedback>
      <SafeAreaView className="bg-[#3A4666]">
        <View className="flex-row justify-between items-center p-4 flex-1 h-[12%]">
          <TouchableOpacity>
            <View className="mt-[7%] ml-[3%]">
              <AntDesign name="bars" size={30} color="white" />
            </View>
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl">Chỉnh sửa công việc</Text>
          </View>
          <TouchableOpacity>
            {/* Chỗ để icon moodle */}
            {/* <AntDesign name="delete" size={25} color="white" /> */}
          </TouchableOpacity>
          {/* Phần tiêu đề */}
        </View>

        <View>
          <Calendar
            style={{ borderRadius: 10, elevation: 4, margin: 40 }}
            markingType={"multi-dot"}
            markedDates={markedDates}
            onDayPress={(date) => {
              console.log(date);
            }}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Schedule;
