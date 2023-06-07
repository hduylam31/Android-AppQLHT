import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  textStyle,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { CatImage } from "../../assets";
import ScheduleService from "../../service/ScheduleService";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from "react-native-table-component";

const ScheduleMain = () => {
  const [selectedTab, setSelectedTab] = useState(false);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState("T.2");
  const dayOfWeek = ["T.2", "T.3", "T.4", "T.5", "T.6", "T.7", "CN"];
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  let [data, setData] = useState([]);
  let [dayLessonMap, setDayLessonMap] = useState({});
  const [onpressDay, setOnpressDay] = useState("");
  const [onpressLessonOfDay, setOnpressLessonOfDay] = useState("");

  console.log(data);

  const state = {
    tableHead: ["Tiết", "T.2", "T.3", "T.4", "T.5", "T.6", "T.7", "CN"],
    tableTitle: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
    ],
    tableData: [
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
    ],
  };

  //==============================================
  function compareObjects(a, b) {
    const dayOrder = {
      "T.2": 0,
      "T.3": 1,
      "T.4": 2,
      "T.5": 3,
      "T.6": 4,
      "T.7": 5,
      CN: 6,
    };

    const dayA = a.DayOfWeek;
    const dayB = b.DayOfWeek;
    const startA = parseFloat(a.lessonStart);
    const startB = parseFloat(b.lessonStart);

    // Sắp xếp theo thứ tự DayOfWeek
    if (dayOrder[dayA] < dayOrder[dayB]) {
      return -1;
    } else if (dayOrder[dayA] > dayOrder[dayB]) {
      return 1;
    }

    // Nếu cùng thuộc cùng một DayOfWeek, sắp xếp theo lessonStart
    if (startA < startB) {
      return -1;
    } else if (startA > startB) {
      return 1;
    }

    return 0;
  }

  // Sắp xếp mảng các object
  data.sort(compareObjects);

  console.log(data);

  //=============================
  const element = (rowIndex, colIndex) => {
    rowIndex++;
    colIndex++;
    let day; // Biến day được khai báo ở đây và có thể sử dụng trong phạm vi của hàm.
    if (colIndex === 1) {
      day = "T.2";
    } else if (colIndex === 2) {
      day = "T.3";
    } else if (colIndex === 3) {
      day = "T.4";
    } else if (colIndex === 4) {
      day = "T.5";
    } else if (colIndex === 5) {
      day = "T.6";
    } else if (colIndex === 6) {
      day = "T.7";
    } else if (colIndex === 7) {
      day = "CN";
    }
    setOnpressDay(day);
    console.log("onpressDay", onpressDay);

    for (let i = 0; i < 30; i++)
      if (i === rowIndex) {
        setOnpressLessonOfDay((i + 1) / 2);
      }

    console.log("onpressLessonOfDay", onpressLessonOfDay);
  };

  checkNumberStart = (a, lessonStartNumber, lessonEndNumber) => {
    if (lessonStartNumber % 1 === 0) {
      a = lessonStartNumber * 2 - 1;
      return a;
    } else {
      a = Math.trunc(lessonStartNumber) * 2;
      return a;
    }
  };

  checkNumberEnd = (b, lessonStartNumber, lessonEndNumber) => {
    if (lessonEndNumber % 1 === 0) {
      b = lessonEndNumber * 2;
      return b;
    } else {
      b = Math.trunc(lessonEndNumber) * 2 - 1;
      return b;
    }
  };

  //let backgroundColorBefore = 0;
  getCellColor = (rowIndex, colIndex) => {
    rowIndex++;
    colIndex++;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const day = item.DayOfWeek;
      const lessonStartNumber = Number(item.lessonStart);
      const lessonEndNumber = Number(item.lessonEnd);
      const titleItem = item.title;

      const a = checkNumberStart(a, lessonStartNumber, lessonEndNumber);
      const b = checkNumberEnd(b, lessonStartNumber, lessonEndNumber);

      if (a <= rowIndex && rowIndex <= b) {
        if (titleItem != undefined) {
          if (day === "T.2" && colIndex === 1) {
            if (i % 2 === 0) {
              return "#B5A9D8";
            } else {
              return "#ADD8A9";
            }
          } else if (day === "T.3" && colIndex === 2) {
            if (i % 2 === 0) {
              return "#B5A9D8";
            } else {
              return "#ADD8A9";
            }
          } else if (day === "T.4" && colIndex === 3) {
            if (i % 2 === 0) {
              return "#B5A9D8";
            } else {
              return "#ADD8A9";
            }
          } else if (day === "T.5" && colIndex === 4) {
            if (i % 2 === 0) {
              return "#B5A9D8";
            } else {
              return "#ADD8A9";
            }
          } else if (day === "T.6" && colIndex === 5) {
            if (i % 2 === 0) {
              return "#B5A9D8";
            } else {
              return "#ADD8A9";
            }
          } else if (day === "T.7" && colIndex === 6) {
            if (i % 2 === 0) {
              return "#B5A9D8";
            } else {
              return "#ADD8A9";
            }
          } else if (day === "CN" && colIndex === 7) {
            if (i % 2 === 0) {
              return "#B5A9D8";
            } else {
              return "#ADD8A9";
            }
          }
        }
      }
    }
    return "#FFFFFF";
  };

  function getListLesson(data) {
    try {
      let listLesson = {
        "T.2": [],
        "T.3": [],
        "T.4": [],
        "T.5": [],
        "T.6": [],
        "T.7": [],
        CN: [],
      };
      let day;
      let lessonStartNumber;
      let lessonEndNumber;
      //Add data
      data.forEach((item) => {
        day = item.DayOfWeek;
        lessonStartNumber = Number(item.lessonStart);
        lessonEndNumber = Number(item.lessonEnd);
        listLesson[day].push(...[lessonStartNumber, lessonEndNumber]);
      });
      //Sort data by lesson in Day
      Object.keys(listLesson).map((key) => {
        listLesson[key].sort((a, b) => {
          return a - b;
        });
      });
      return listLesson;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  const loadData = async () => {
    try {
      const scheduleData = await ScheduleService.loadScheduleData();
      setData(scheduleData);
      let dayLessonMap = await getListLesson(scheduleData);
      setDayLessonMap(dayLessonMap);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const route = useRoute();
  useEffect(() => {
    if (
      route?.params?.screenSchedule === "AddToMain" ||
      route?.params?.screenSchedule === "EditToMain" ||
      route?.params?.screenSchedule === "DeleteToMain"
    ) {
      loadData();
    }
  }, [route]);

  // useEffect(() => {
  //   if (isFocused) {
  //     loadData();
  //   }
  // }, [isFocused]);

  const onDayPress = (day) => {
    console.log(day);
    setSelectedDayOfWeek(day);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const ListEmptyComponent = () => (
    <View className="h-96 flex justify-center items-center">
      <Image source={CatImage} className="w-100 h-100 mb-5" />
      <Text>Bạn chưa có lịch học</Text>
    </View>
  );

  renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Schedule_Edit", {
          c_id: item.id,
          c_title: item.title,
          c_DayOfWeek: item.DayOfWeek,
          c_lessonStart: item.lessonStart,
          c_lessonEnd: item.lessonEnd,
          c_location: item.location,
          c_note: item.note,
          dayLessonMap,
        });
      }}
    >
      <Animatable.View
        animation="flipInX"
        delay={index * 10}
        className="mx-4 my-[3%] bg-white rounded-xl flex-1 flex-row content-center"
        style={{
          shadowColor: "#000000",
          shadowOffset: { width: 10, height: 10 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 7,
        }}
      >
        <View className="flex justify-center items-center w-[15%] ">
          <Text className="text-sm font-medium">Tiết</Text>
          <Text className="text-sm font-medium">
            {item.lessonStart} - {item.lessonEnd}
          </Text>
        </View>
        <View className="w-[1%] h-[70%] mt-[4%] mr-[3%] bg-[#FE8668] "></View>
        <View className="my-3 w-[75%]">
          <View className="flex-row justify-start items-center">
            <MaterialCommunityIcons name="bookmark" size={17} color="#23ACCD" />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-base font-medium ml-1"
            >
              {item.title}
            </Text>
          </View>
          <View className="flex-row items-center justify-start">
            <MaterialCommunityIcons
              name="map-marker"
              size={17}
              color="#FF0404"
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-sm font-normal ml-1"
            >
              {item.location}
            </Text>
          </View>
          <View className="flex-row items-center justify-start">
            <MaterialCommunityIcons
              name="file-document-outline"
              size={17}
              color="#3A4666"
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-sm font-normal ml-1"
            >
              {item.note}
            </Text>
          </View>
        </View>
      </Animatable.View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView className="flex-1">
        <View className="h-[30%] bg-[#3A4666]">
          <View className="flex-row justify-between items-center h-[26%] pl-4 pr-1">
            <View className="w-4 h-4 "></View>
            <Text className="text-white text-[22px] font-semibold">
              Thời khóa biểu
            </Text>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={28}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <View className="justify-center items-center">
            <View className="w-[45%] h-7 border-1 rounded-xl bg-[#9CA2B2] flex-row items-center">
              <TouchableOpacity
                onPress={() => {
                  setSelectedTab(false);
                }}
                className={`w-[50%] h-[96%] bg-white items-center justify-center rounded-xl ${
                  !selectedTab ? "bg-white" : "bg-[#9CA2B2]"
                }`}
              >
                <Text>Ngày</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedTab(true);
                }}
                className={`w-[50%] h-[96%] bg-white items-center justify-center rounded-xl ${
                  selectedTab ? "bg-white" : "bg-[#9CA2B2]"
                }`}
              >
                <Text>Tuần</Text>
              </TouchableOpacity>
            </View>
          </View>
          {!selectedTab && (
            <View className="bg-white mt-6 h-[35%] mx-4 rounded-xl px-4 flex-row justify-between items-center">
              {dayOfWeek.map((day) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => onDayPress(day)}
                  className={`justify-center items-center h-[35%] w-[11%] rounded-lg ${
                    day === selectedDayOfWeek ? "bg-[#FE8668]" : "bg-[#f9c2b4]"
                  }`}
                >
                  <Text>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View className="bg-[#F1F5F9] w-full h-full">
          {!selectedTab && (
            <View className="bg-[#F1F5F9] w-full h-[60%]">
              <FlatList
                data={data.filter(
                  (ScheduleData) => ScheduleData.DayOfWeek === selectedDayOfWeek
                )}
                keyExtractor={(item) => item.id.toString()}
                renderItem={this.renderItem}
                ListEmptyComponent={ListEmptyComponent}
              />
            </View>
          )}
        </View>
        {selectedTab && (
          <View className="absolute w-full top-32 h-[80%]">
            <View
              style={{
                padding: 12,
                backgroundColor: "#ffffff",
                borderWidth: 0.5,
                borderRadius: 10,
                width: "90%",
                marginLeft: "5%",
              }}
            >
              <Row
                data={state.tableHead}
                flexArr={[2, 1, 1, 1, 1, 1, 1, 1, 1]}
                style={{
                  height: 32,
                  backgroundColor: "#FFC3B3",
                }}
                textStyle={{ textAlign: "center", fontWeight: "bold" }}
                borderStyle={{ borderWidth: 1, borderColor: "#DEDEDE" }}
              />
              <View className="flex-row">
                <Col
                  data={state.tableTitle}
                  style={{
                    flex: 2.25,
                    backgroundColor: "#f6f8fa",
                  }}
                  textStyle={{ textAlign: "center", fontWeight: "bold" }}
                  heightArr={20}
                  borderStyle={{ borderWidth: 1, borderColor: "#DEDEDE" }}
                />
                <View style={{ flex: 8, backgroundColor: "#FFFFFF" }}>
                  {state.tableData.map((rowData, rowIndex) => (
                    <View
                      key={rowIndex}
                      style={{
                        flexDirection: "row",
                        backgroundColor: "#FFFFFF",
                        height: 13,
                      }}
                    >
                      {rowData.map((cellData, colIndex) => (
                        <TouchableOpacity
                          key={colIndex}
                          style={{
                            flex: 1,
                            borderWidth: 0.2,
                            borderColor: "#DEDEDE",
                            textAlign: "center",
                            backgroundColor: this.getCellColor(
                              rowIndex,
                              colIndex
                            ),
                          }}
                          data={
                            this.getCellColor(rowIndex, colIndex) != "#FFFFFF"
                          }
                          onPress={() => element(rowIndex, colIndex)}
                        >
                          {/* <Text>{cellData}</Text> */}
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <View>
              <FlatList
                data={data.filter(
                  (ScheduleData) =>
                    ScheduleData.DayOfWeek === onpressDay &&
                    Number(ScheduleData.lessonStart) <=
                      Number(onpressLessonOfDay) &&
                    Number(ScheduleData.lessonEnd) + 0.5 >=
                      Number(onpressLessonOfDay)
                )}
                keyExtractor={(item) => item.id.toString()}
                renderItem={this.renderItem}
              />
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Schedule_Add", dayLessonMap);
          }}
          className="w-[90%] h-[5.5%] absolute bottom-[2%] ml-[5%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <Text className="text-white text-center font-bold text-base">
            Thêm thời khóa biểu
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ScheduleMain;
