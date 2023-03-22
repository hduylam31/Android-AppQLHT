import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import CalendarService from "../../service/CalendarService";

const CalendarMain = () => {
  const [markedDates, setMarkedDates] = useState();
  const markedDateJson = {};
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        const calendarData = await CalendarService.loadAndProcessCalendar();
        setMarkedDates(calendarData);
      } catch (error) {
        console.log(error);
      }
    };
    loadCalendar();
  }, []);

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

export default CalendarMain;
