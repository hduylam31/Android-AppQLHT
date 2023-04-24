import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
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
import moment from "moment";
import AppLoader from "../AppLoader/AppLoader";

LocaleConfig.locales["fr"] = {
  monthNames: [
    "Tháng 1,",
    "Tháng 2,",
    "Tháng 3,",
    "Tháng 4,",
    "Tháng 5,",
    "Tháng 6,",
    "Tháng 7,",
    "Tháng 8,",
    "Tháng 9,",
    "Tháng 10,",
    "Tháng 11,",
    "Tháng 12,",
  ],
  monthNames: [
    "Tháng 1,",
    "Tháng 2,",
    "Tháng 3,",
    "Tháng 4,",
    "Tháng 5,",
    "Tháng 6,",
    "Tháng 7,",
    "Tháng 8,",
    "Tháng 9,",
    "Tháng 10,",
    "Tháng 11,",
    "Tháng 12,",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = "fr";

const CalendarMain = () => {
  const [markedDates, setMarkedDates] = useState();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const [calendar, setCalendar] = useState([]);
  const currentDate = new Date().toLocaleDateString();

  const [selectedDay, setSelectedDay] = useState(
    moment(currentDate, "DD/MM/YYYY").format("YYYY-MM-DD")
  );

  const [isMoodleActive, setIsMoodleActive] = useState();

  const LoadMoodleActive = async () => {
    try {
      const moodleActive = await CalendarService.isMoodleActive();
      setIsMoodleActive(moodleActive);
      console.log("Moodle activee: ", moodleActive);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    LoadMoodleActive();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const loadCalendar = async () => {
    try {
      // setIsLoading(true);
      const calendar = await CalendarService.loadCalendarData();
      console.log("calendar: ", calendar);
      setCalendar(calendar);
      const calendarProcess = await CalendarService.processDataForCalendar(
        calendar
      );
      setMarkedDates(calendarProcess);
      // setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCalendar1 = async () => {
    try {
      setIsLoading(true);
      const calendar = await CalendarService.loadCalendarData();
      console.log("calendar: ", calendar);
      setCalendar(calendar);
      const calendarProcess = await CalendarService.processDataForCalendar(
        calendar
      );
      setMarkedDates(calendarProcess);
      setIsLoading(false);
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
      route?.params?.screenCalendar === "UpdateMoodleToMain" ||
      route?.params?.screenCalendar === "LogoutMoodleToMain"
    ) {
      loadCalendar1();
      LoadMoodleActive();
    } else if (
      route?.params?.screenCalendar === "AddToMain" ||
      route?.params?.screenCalendar === "EditToMain" ||
      route?.params?.screenCalendar === "DeleteToMain"
    ) {
      loadCalendar();
      LoadMoodleActive();
    }
  }, [route]);

  const filteredMoodle = calendar.filter((item) => {
    const showMoodle =
      item.isMoodle === "true" && item.dateString === selectedDay;
    return showMoodle;
  });

  const filteredIndividual = calendar.filter((item) => {
    const showIndividual =
      item.isMoodle === "false" && item.dateString === selectedDay;
    return showIndividual;
  });

  // useEffect(() => {
  //   if (isFocused) {
  //     loadCalendar();
  //   }
  // }, [isFocused]);

  renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Calendar_Edit", { item });
      }}
    >
      <Animatable.View animation="slideInLeft" delay={index * 10}>
        <View className="h-12 flex-row">
          <View className={"w-[12%] flex ml-[3%]"}>
            <Text className={"text-sm font-semibold "}>{item.timeString}</Text>
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
        </View>
      </Animatable.View>
      <View className="w-[94%] ml-[3%] h-[2px] bg-[#f3f2f4]"></View>
    </TouchableOpacity>
  );

  // const [selectedDate, setSelectedDate] = useState("");
  // const [selected, setSelected] = useState();

  const marked = useMemo(
    () => ({
      ...markedDates,
      [selectedDay]: {
        selected: true,
        selectedColor: "#3A4666",
        selectedTextColor: "white",
      },
    }),
    [selectedDay, markedDates]
  );

  console.log(isMoodleActive);

  //Logout Moodle
  const AlertLogoutMoodle = () => {
    Alert.alert("", "Hủy kết nối đến moodle ?", [
      {
        text: "Đồng ý",
        onPress: handleLogoutMoodle,
      },
      {
        text: "Hủy",
        onPress: () => {
          console.log("No Pressed");
        },
      },
    ]);
  };

  const handleLogoutMoodle = async () => {
    console.log("Start logout");
    try {
      await CalendarService.logOutMoodle(0);
      navigation.navigate("BottomBar", {
        screen: "Lịch",
        params: {
          screenCalendar: "LogoutMoodleToMain",
        },
      });
    } catch (error) {
      console.log("Fail due too: ", error);
    }
  };

  const AlertErrorMoodle = () => {
    Alert.alert("Lỗi kết nối với moodle", "Vui lòng đăng nhập lại moodle", [
      {
        text: "Đồng ý",
        onPress: () => {
          navigation.navigate("Login_Moodle");
        },
      },

      {
        text: "Hủy",
        onPress: () => {
          console.log("No Pressed");
        },
      },
    ]);
  };

  if (isLoading) {
    return <AppLoader />;
  }
  return (
    <TouchableWithoutFeedback>
      <SafeAreaView className="flex-1 bg-[#23ACCD]">
        <View className="bg-[#3A4666] h-[30%]">
          <View className="flex-row justify-between items-center p-4">
            <View className="flex-row">
              {/* Chỗ để icon moodle */}
              {isMoodleActive === 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Login_Moodle");
                  }}
                >
                  <Animatable.Image
                    animation="fadeIn"
                    easing="ease-in-out"
                    source={MoodleIcon}
                  />
                </TouchableOpacity>
              ) : isMoodleActive === 1 ? (
                <TouchableOpacity onPress={AlertLogoutMoodle}>
                  <Animatable.Image
                    animation="fadeIn"
                    easing="ease-in-out"
                    source={MoodleIcon}
                  />
                  <View className="absolute right-0 bottom-0">
                    <AntDesign name="checkcircle" size={10} color="green" />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={AlertErrorMoodle}>
                  <Animatable.Image
                    animation="fadeIn"
                    easing="ease-in-out"
                    source={MoodleIcon}
                  />
                  <View className="absolute right-0 bottom-0">
                    <AntDesign
                      name="exclamationcircle"
                      size={10}
                      color="#FBB500"
                    />
                  </View>
                </TouchableOpacity>
              )}
              <View className="w-8 h-8"></View>
            </View>

            <View>
              <Text className="text-white text-2xl font-bold">Lịch</Text>
            </View>

            {/* Chỗ để iconSearch */}
            <View className="flex-row">
              <View className="w-8 h-8"></View>
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={32}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="bg-[#F1F5F9] h-full"></View>
        <View className="absolute w-full bottom-16 h-[85%]">
          <Calendar
            theme={{
              "stylesheet.calendar.header": {
                dayTextAtIndex0: {
                  color: "red",
                },
                dayTextAtIndex6: {
                  color: "blue",
                },
              },
            }}
            style={{
              borderRadius: 8,
              margin: "5%",
              shadowColor: "#000000",
              shadowOffset: { width: 10, height: 10 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 10,
            }}
            enableSwipeMonths={true}
            markingType={"multi-dot"}
            markedDates={marked}
            onDayPress={(date) => {
              setSelectedDay(date.dateString);
              // props.onDaySelect && props.onDaySelect(date);
            }}
            // markedDates={marked}
            // {...props}
          />
          <View className="max-h-64">
            {filteredMoodle.length > 0 && (
              <View
                className=" bg-white rounded-xl mx-[3%] mt-[4%] flex-1 flex-row"
                style={{
                  shadowColor: "#000000",
                  shadowOffset: { width: 10, height: 10 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 10,
                }}
              >
                <FlatList
                  data={filteredMoodle}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={this.renderItem}
                />
              </View>
            )}
            {filteredIndividual.length > 0 && (
              <View
                className=" bg-white rounded-xl mx-[3%] mt-[4%] flex-1 flex-row"
                style={{
                  shadowColor: "#000000",
                  shadowOffset: { width: 10, height: 10 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 10,
                }}
              >
                <FlatList
                  data={filteredIndividual}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={this.renderItem}
                />
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Calendar_Add", { selectedDay });
          }}
          className="w-[90%] h-10 absolute bottom-5 ml-[5%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <Text className="text-white text-center font-bold text-base">
            Thêm sự kiện mới
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CalendarMain;
