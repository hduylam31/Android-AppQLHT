import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import CalendarService from "../../service/CalendarService";
import { MoodleIcon } from "../../assets";

const CalendarMain = () => {
  const [markedDates, setMarkedDates] = useState();
  const markedDateJson = {};
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const [calendar, setCalendar] = useState([]);
  const [selectDay, setSelectDay] = useState([]);
  const [isMoodleActive, setIsMoodleActive] = useState();

  const loadCalendarData = async () => {
    const calendar = await CalendarService.loadCalendarData();
    setCalendar(calendar);
    console.log("list2: ", calendar);
  };

  useEffect(() => {
    const isMoodleActive = async () => {
      const moodleActive = await CalendarService.isMoodleActive();
      setIsMoodleActive(moodleActive);
      console.log("Moodle active: ", calendar);
    };
    isMoodleActive();
  }, []);

  useEffect(() => {
    loadCalendarData();
  }, []);

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

  renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Calendar_Edit");
        //   id: item.id,
        //   title: item.title,
        //   category: item.category,
        //   isNotified: item.isNotified,
        //   hour: item.hour,
        //   text: item.text,
        //   isCompleted: item.isCompleted,
        // });
      }}
    >
      <Animatable.View
        animation="slideInLeft"
        delay={index * 10}
        className="w-full h-12 h-min-full border-b-[#f3f2f4] border-b-2 my-1 flex flex-row content-center"
      >
        <Text className={"text-base font-semibold "}>{item.time}</Text>
        <View
          className={`w-[2%] h-[85%] mx-[5%]  ${
            item.isMoodle === "true" ? "bg-[#FF0101]" : "bg-[#24b929]"
          }`}
        ></View>
        <Text className={"text-base font-semibold"}>{item.title}</Text>
      </Animatable.View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-[60%]">
          <View className="flex-row justify-between items-center h-[10%] mt-2">
            <TouchableOpacity>
              <View className="ml-4">
                <AntDesign name="bars" size={32} color="white" />
              </View>
            </TouchableOpacity>
            <View>
              <Text className="text-white text-xl">Chỉnh sửa công việc</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Login_Moodle");
              }}
              className="mr-4"
            >
              {/* Chỗ để icon moodle */}
              <Animatable.Image
                animation="fadeIn"
                easing="ease-in-out"
                source={MoodleIcon}
              />
            </TouchableOpacity>
            {/* Phần tiêu đề */}
          </View>

          <Calendar
            style={{ borderRadius: 10, elevation: 4, margin: 15 }}
            markingType={"multi-dot"}
            markedDates={markedDates}
            onDayPress={(date) => {
              setSelectDay(date);
              console.log(date);
            }}
          />
        </View>
        <View className="flex-1 bg-[#F1F5F9]">
          <View className="w-[94%] h-[36%] bg-white rounded-2xl mx-[3%] mt-[3%] flex flex-row items-center">
            <FlatList
              data={calendar.filter((item) => {
                if (
                  item.isMoodle === "true" &&
                  item.dateString === selectDay.dateString
                )
                  return true;
                return false;
              })}
              keyExtractor={(item) => item.id.toString()}
              renderItem={this.renderItem}
            />
          </View>
          <View className="w-[94%] h-[36%] bg-white rounded-2xl mx-[3%] mt-[3%] flex flex-row items-center">
            <FlatList
              data={calendar.filter((item) => {
                if (
                  item.isMoodle === "false" &&
                  item.dateString === selectDay.dateString
                )
                  return true;
                return false;
              })}
              keyExtractor={(item) => item.id.toString()}
              renderItem={this.renderItem}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Calendar_Add");
          }}
          className="w-[70%] h-[5%] absolute bottom-2 ml-[15%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
        >
          <Text className="text-white text-center font-bold text-ls">
            Thêm sự kiện
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CalendarMain;
