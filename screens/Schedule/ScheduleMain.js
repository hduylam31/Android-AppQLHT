import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { CatImage } from "../../assets";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from "react-native-table-component";

const colors = ["#FFC3B3", "#f6f8fa", "#DEDEDE"];

const ScheduleMain = () => {
  const [selectedTab, setSelectedTab] = useState(false);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState("T.2");
  const dayOfWeek = ["T.2", "T.3", "T.4", "T.5", "T.6", "T.7", "CN"];
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  this.state = {
    tableHead: ["Tiết", "T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    tableTitle: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
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
    ],
  };

  getCellColor = (rowIndex, colIndex) => {
    // Check if the current cell is in the first row or column
    // if (rowIndex === 0 || colIndex === 0) {
    //   return "#FFC3B3"; // Set the background color to pink
    // }
    // // Check if the current cell is in an even row
    // else
    if (rowIndex % 2 === 0) {
      return "#F5F5F5"; // Set the background color to light gray
    }
    // Check if the current cell is in an odd row
    else if (rowIndex % 2 === 1) {
      return "#FFFFFF"; // Set the background color to white
    }
  };

  const data = [
    {
      id: "1",
      title: "Nhập môn công nghệ thông tin",
      DayOfWeek: "T.2",
      lessonStart: "1",
      lessonEnd: "3",
      location: "E302",
      note: "Giáo viên: Nguyễn Văn A",
    },
    {
      id: "2",
      title: "Nhập môn công nghệ thông",
      DayOfWeek: "T.2",
      lessonStart: "1",
      lessonEnd: "3",
      location: "E302",
      note: "Giáo viên: Nguyễn Văn A",
    },
    {
      id: "3",
      title: "Nhập môn công nghệ",
      DayOfWeek: "T.2",
      lessonStart: "1",
      lessonEnd: "3",
      location: "E302",
      note: "Giáo viên: Nguyễn Văn A",
    },
    {
      id: "4",
      title: "Nhập môn công",
      DayOfWeek: "T.3",
      lessonStart: "1",
      lessonEnd: "3",
      location: "E302",
      note: "Giáo viên: Nguyễn Văn A",
    },
    {
      id: "5",
      title: "Nhập môn",
      DayOfWeek: "T.3",
      lessonStart: "1",
      lessonEnd: "3",
      location: "E302",
      note: "Giáo viên: Nguyễn Văn A",
    },
    {
      id: "6",
      title: "Nhập môn công nghệ thông tin",
      DayOfWeek: "T.2",
      lessonStart: "1",
      lessonEnd: "3",
      location: "E302",
      note: "Giáo viên: Nguyễn Văn A",
    },
    {
      id: "7",
      title: "Nhập môn công nghệ thông tin",
      DayOfWeek: "T.2",
      lessonStart: "1",
      lessonEnd: "3",
      location: "E302",
      note: "Giáo viên: Nguyễn Văn A",
    },
    {
      id: "8",
      title: "Nhập môn công nghệ thông tin",
      DayOfWeek: "T.2",
      lessonStart: "1",
      lessonEnd: "3",
      location: "E302",
      note: "Giáo viên: Nguyễn Văn A",
    },
    {
      id: "9",
      title: "Nhập môn công nghệ thông tin",
      DayOfWeek: "T.2",
      lessonStart: "1",
      lessonEnd: "3",
      location: "E302",
      note: "Giáo viên: Nguyễn Văn A",
    },
  ];

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
    <TouchableOpacity>
      <Animatable.View
        animation="slideInLeft"
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
      <SafeAreaView className="flex-1 relative">
        <View className="h-[25%] bg-[#3A4666]">
          <View className="flex-row mt-[3%]">
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={32}
                color="white"
              />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold ml-[22%]">
              Thời khóa biểu
            </Text>
          </View>
          <View className="justify-center items-center mt-[3%]">
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
            <View className="bg-white mt-[3%] h-[40%] w-[90%] ml-[5%] rounded-xl">
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
            <View style={styles.container}>
              <Row
                data={state.tableHead}
                flexArr={[2, 1, 1, 1, 1, 1, 1, 1, 1]}
                style={{ height: 40, backgroundColor: "#FFC3B3" }}
                textStyle={{ textAlign: "center" }}
                borderStyle={{ borderWidth: 1, borderColor: "#DEDEDE" }}
              />
              <View className="flex-row">
                <Col
                  data={state.tableTitle}
                  style={{ flex: 2.25, backgroundColor: "#f6f8fa" }}
                  heightArr={20}
                  textStyle={{ textAlign: "center" }}
                  borderStyle={{ borderWidth: 1, borderColor: "#DEDEDE" }}
                />
                <View style={styles.container}>
                  {state.tableData.map((rowData, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                      {rowData.map((cellData, colIndex) => (
                        <View
                          key={colIndex}
                          style={[
                            styles.cell,
                            {
                              backgroundColor: this.getCellColor(
                                rowIndex,
                                colIndex
                              ),
                            },
                          ]}
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
          // onPress={() => {
          //   navigation.navigate("Calendar_Add");
          // }}
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

const styles = StyleSheet.create({
  container: {
    flex: 8,
    backgroundColor: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    height: 15,
  },
  cell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "#DEDEDE",
    textAlign: "center",
  },
});

export default ScheduleMain;
