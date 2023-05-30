import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CalendarService from "../../service/CalendarService";
import * as Animatable from "react-native-animatable";

const CalendarExtendMoodleEvent = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const [calendar, setCalendar] = useState([]);
  const loadCalendar = async () => {
    try {
      // setIsLoading(true);
      const calendar = await CalendarService.loadCalendarData();
      console.log("calendar: ", calendar);
      setCalendar(calendar);
      // setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  const filteredMoodle = calendar.filter((item) => {
    const showMoodle = item.isMoodle === "true";
    return showMoodle;
  });

  renderItem = ({ item, index }) => (
    <>
      <Text className="pl-4 mt-4 text-base font-semibold">
        {item.dateString}
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Calendar_Edit", { item });
        }}
        className=" bg-white rounded-xl mx-[3%] mt-[4%] flex-1 flex-row"
        style={{
          shadowColor: "#000000",
          shadowOffset: { width: 10, height: 10 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        <Animatable.View animation="slideInLeft" delay={index * 10}>
          <View className="h-12 flex-row">
            <View className={"w-[12%] flex ml-[3%]"}>
              <Text className={"text-sm font-normal "}>{item.timeString}</Text>
            </View>
            <View
              className={`w-[2%] h-[80%] mx-[3%] my-1 ${
                item.isMoodle === "true" ? "bg-[#FF0101]" : "bg-[#24b929]"
              }`}
            ></View>
            <View className="w-[70%] flex-row">
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className={"text-base font-normal"}
              >
                {item.title}
              </Text>
              <View className={"mt-1 ml-1"}>
                {!item.isNotified && (
                  <MaterialCommunityIcons
                    name="bell-off-outline"
                    size={14}
                    color="black"
                  />
                )}
              </View>
            </View>
          </View>
        </Animatable.View>
        <View className="w-[94%] ml-[3%] h-[2px] bg-[#f3f2f4]"></View>
      </TouchableOpacity>
      <View className="h-1"></View>
    </>
  );

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
              <Text className="text-white text-xl font-medium">
                Sự kiện moodle
              </Text>
            </View>
            <View className="w-8 h-8"></View>

            {/* Phần tiêu đề */}
          </View>
        </View>
        <View className="bg-[#F1F5F9] h-full">
          {filteredMoodle.length > 0 && (
            <FlatList
              data={filteredMoodle}
              keyExtractor={(item) => item.id.toString()}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CalendarExtendMoodleEvent;
