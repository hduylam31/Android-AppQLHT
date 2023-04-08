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
    ],
  };

  getCellColor = (rowIndex, colIndex) => {
    rowIndex++;
    colIndex++;
    let day;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const day = item.DayOfWeek;
      const lessonStartNumber = Number(item.lessonStart);
      const lessonEndNumber = Number(item.lessonEnd);

      if (day === "T.2") {
        if (
          colIndex === 1 &&
          rowIndex >= lessonStartNumber + lessonStartNumber - 1
        ) {
          if (lessonEndNumber % 1 != 0 && rowIndex < lessonEndNumber * 2 - 1) {
            return "#4B5347";
          } else if (
            lessonEndNumber % 1 === 0 &&
            rowIndex < lessonEndNumber * 2 + 1
          ) {
            return "#4B5347";
          }
        }
      } else if (day === "T.3") {
        if (
          colIndex === 2 &&
          rowIndex >= lessonStartNumber + lessonStartNumber - 1
        ) {
          if (lessonEndNumber % 1 != 0 && rowIndex < lessonEndNumber * 2 - 1) {
            return "#4B5347";
          } else if (
            lessonEndNumber % 1 === 0 &&
            rowIndex < lessonEndNumber * 2 + 1
          ) {
            return "#4B5347";
          }
        }
      } else if (day === "T.4") {
        if (
          colIndex === 3 &&
          rowIndex >= lessonStartNumber + lessonStartNumber - 1
        ) {
          if (lessonEndNumber % 1 != 0 && rowIndex < lessonEndNumber * 2 - 1) {
            return "#4B5347";
          } else if (
            lessonEndNumber % 1 === 0 &&
            rowIndex < lessonEndNumber * 2 + 1
          ) {
            return "#4B5347";
          }
        }
      } else if (day === "T.5") {
        if (
          colIndex === 4 &&
          rowIndex >= lessonStartNumber + lessonStartNumber - 1
        ) {
          if (lessonEndNumber % 1 != 0 && rowIndex < lessonEndNumber * 2 - 1) {
            return "#4B5347";
          } else if (
            lessonEndNumber % 1 === 0 &&
            rowIndex < lessonEndNumber * 2 + 1
          ) {
            return "#4B5347";
          }
        }
      } else if (day === "T.6") {
        if (
          colIndex === 5 &&
          rowIndex >= lessonStartNumber + lessonStartNumber - 1
        ) {
          if (lessonEndNumber % 1 != 0 && rowIndex < lessonEndNumber * 2 - 1) {
            return "#4B5347";
          } else if (
            lessonEndNumber % 1 === 0 &&
            rowIndex < lessonEndNumber * 2 + 1
          ) {
            return "#4B5347";
          }
        }
      } else if (day === "T.7") {
        if (
          colIndex === 6 &&
          rowIndex >= lessonStartNumber + lessonStartNumber - 1
        ) {
          if (lessonEndNumber % 1 != 0 && rowIndex < lessonEndNumber * 2 - 1) {
            return "#4B5347";
          } else if (
            lessonEndNumber % 1 === 0 &&
            rowIndex < lessonEndNumber * 2 + 1
          ) {
            return "#4B5347";
          }
        }
      } else if (day === "CN") {
        if (
          colIndex === 7 &&
          rowIndex >= lessonStartNumber + lessonStartNumber - 1
        ) {
          if (lessonEndNumber % 1 != 0 && rowIndex < lessonEndNumber * 2 - 1) {
            return "#4B5347";
          } else if (
            lessonEndNumber % 1 === 0 &&
            rowIndex < lessonEndNumber * 2 + 1
          ) {
            return "#4B5347";
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
        className="mx-[5%] my-[3%] bg-white rounded-xl flex-1 flex-row content-center"
      >
        <View className="flex justify-center items-center w-[15%] ">
          <Text className="text-base font-medium">Tiết</Text>
          <Text className="text-base font-medium">
            {item.lessonStart} - {item.lessonEnd}
          </Text>
        </View>
        <View className="w-[1%] h-[70%] mt-[4%] mr-[3%] bg-[#FE8668] "></View>
        <View className=" my-3">
          <View className="flex-row">
            <MaterialCommunityIcons
              style={{ marginTop: 2 }}
              name="bookmark"
              size={18}
              color="#23ACCD"
            />
            <Text className="text-base font-medium ml-1">{item.title}</Text>
          </View>
          <View className="flex-row">
            <MaterialCommunityIcons
              style={{ marginTop: 2 }}
              name="map-marker"
              size={16}
              color="#FF0404"
            />
            <Text className="text-sm font-normal ml-1">{item.location}</Text>
          </View>
          <View className="flex-row">
            <MaterialCommunityIcons
              style={{ marginTop: 2 }}
              name="file-document-outline"
              size={16}
              color="#3A4666"
            />
            <Text className="text-sm font-normal ml-1">{item.note}</Text>
          </View>
        </View>
      </Animatable.View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView className="flex-1">
        <View className="h-[25%] bg-[#3A4666]">
          <View className="flex-row justify-between p-4">
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={32}
                color="white"
              />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">
              Thời khóa biểu
            </Text>
            <View className="w-8 h-8 "></View>
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
            <View className="bg-white mt-[3%] h-[35%] w-[90%] ml-[5%] rounded-xl">
              <View className="h-full w-[90%] flex-row justify-between items-center ml-[5%]">
                {dayOfWeek.map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => onDayPress(day)}
                    className={`justify-center items-center h-[35%] w-[11%] rounded-lg ${
                      day === selectedDayOfWeek
                        ? "bg-[#FE8668]"
                        : "bg-[#f9c2b4]"
                    }`}
                  >
                    <Text>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
        <View className="bg-[#F1F5F9] w-full h-full">
          {!selectedTab && (
            <View className="bg-[#F1F5F9] w-full h-[65%]">
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
          <View
            style={{
              weight: "80%",
              padding: 16,
              backgroundColor: "#ffffff",
              borderWidth: 0.5,
              borderRadius: 10,
              position: "absolute",
              width: "95%",
            }}
            className="self-center top-[18%]"
          >
            <View>
              <Row
                data={state.tableHead}
                flexArr={[2, 1, 1, 1, 1, 1, 1, 1, 1]}
                style={{
                  height: 40,
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
                        height: 20,
                      }}
                    >
                      {rowData.map((cellData, colIndex) => (
                        <View
                          key={colIndex}
                          style={{
                            flex: 1,
                            borderWidth: 0.5,
                            borderColor: "#DEDEDE",
                            textAlign: "center",
                            backgroundColor: this.getCellColor(
                              rowIndex,
                              colIndex
                            ),
                          }}
                        >
                          <Text>{cellData}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Schedule_Add", dayLessonMap);
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

export default ScheduleMain;
