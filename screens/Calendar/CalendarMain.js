import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import CalendarService from "../../service/CalendarService";
import { MoodleIcon } from "../../assets";

const CalendarMain = (props) => {
  const [markedDates, setMarkedDates] = useState();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const [calendar, setCalendar] = useState([]);
  const [selectDay, setSelectDay] = useState([]);
  const [isMoodleActive, setIsMoodleActive] = useState();

  useEffect(() => {
    const isMoodleActive = async () => {
      try {
        const moodleActive = await CalendarService.isMoodleActive();
        setIsMoodleActive(moodleActive);
        console.log("Moodle activee: ", moodleActive);
      } catch (error) {}
    };
    isMoodleActive();
  }, []);

  const loadCalendar = async () => {
    try {
      const calendar = await CalendarService.loadCalendarData();
      setCalendar(calendar);
      const calendarProcess = await CalendarService.processDataForCalendar(
        calendar
      );
      setMarkedDates(calendarProcess);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  const route = useRoute();
  useEffect(() => {
    if (
      route?.params?.screenCalendar === "AddToMain" ||
      route?.params?.screenCalendar === "EditToMain" ||
      route?.params?.screenCalendar === "DeleteToMain"
    ) {
      loadCalendar();
    }
  }, [route]);

  // useEffect(() => {
  //   if (isFocused) {
  //     loadCalendar();
  //   }
  // }, [isFocused]);

  renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Calendar_Edit", {
          c_id: item.id,
          c_title: item.title,
          c_dateString: item.dateString,
          c_timeString: item.timeString,
          c_description: item.description,
          c_isNotified: item.isNotified,
          c_isMoodle: item.isMoodle,
        });
      }}
    >
      <Animatable.View
        animation="slideInLeft"
        delay={index * 10}
        className="h-12 h-min-full border-b-[#f3f2f4] border-b-2 my-1 flex flex-row content-center"
      >
        <View className={"w-[10%] flex ml-[3%]"}>
          <Text className={"text-sm font-semibold "}>{item.timeString}</Text>
        </View>
        <View
          className={`w-[2%] h-[85%] mx-[3%]  ${
            item.isMoodle === "true" ? "bg-[#FF0101]" : "bg-[#24b929]"
          }`}
        ></View>
        <View className="w-[70%] flex-row">
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            className={"text-sm font-semibold"}
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
      </Animatable.View>
    </TouchableOpacity>
  );

  // const [selectedDate, setSelectedDate] = useState("");
  const [selected, setSelected] = useState();

  const marked = useMemo(
    () => ({
      ...markedDates,
      [selected]: {
        selected: true,
        selectedColor: "#393E36",
        selectedTextColor: "white",
      },
    }),
    [selected, markedDates]
  );

  console.log(isMoodleActive);

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-[25%]">
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity>
              <AntDesign name="bars" size={30} color="white" />
            </TouchableOpacity>
            <View>
              <Text className="text-white text-2xl font-bold">Lịch</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Login_Moodle");
              }}
            >
              {/* Chỗ để icon moodle */}
              <Animatable.Image
                animation="fadeIn"
                easing="ease-in-out"
                source={MoodleIcon}
              />

              {/* Phần này là Icon tích xanh và chấm than hãy code thêm trạng thái */}

              {isMoodleActive === 1 && (
                <View className="absolute right-0 bottom-0">
                  <AntDesign name="checkcircle" size={10} color="green" />
                </View>
              )}
              {isMoodleActive === -1 && (
                <View className="absolute right-0 bottom-0">
                  <AntDesign
                    name="exclamationcircle"
                    size={10}
                    color="#FBB500"
                  />
                </View>
              )}
            </TouchableOpacity>
            {/* Phần tiêu đề */}
          </View>
        </View>
        <View className="bg-[#F1F5F9] h-full w-full">
          <View className="w-full mt-[60%] h-[35%]">
            <View className=" bg-white rounded-2xl mx-[3%] mt-[4%] flex-1 flex-row">
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
            <View className=" bg-white rounded-2xl mx-[3%] mt-[4%] flex-1 flex-row">
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
        </View>
        <View className="absolute w-full top-20">
          <Calendar
            style={{
              borderRadius: 10,
              elevation: 4,
              margin: "5%",
            }}
            markingType={"multi-dot"}
            markedDates={marked}
            onDayPress={(date) => {
              setSelectDay(date);
              setSelected(date.dateString);
              props.onDaySelect && props.onDaySelect(date);
            }}
            // markedDates={marked}
            {...props}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Calendar_Add");
          }}
          className="w-[70%] h-[5%] absolute bottom-2 ml-[15%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
        >
          <Text className="text-white text-center font-bold text-base">
            Thêm thời khóa biểu
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CalendarMain;
