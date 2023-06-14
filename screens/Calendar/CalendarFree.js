import { DataTimeNoti, DataCategoriTimeNoti } from "./DataOfDropDown";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Switch,
  TextInput,
  FlatList,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "react-native-vector-icons/Ionicons";

import DateTimePicker from "@react-native-community/datetimepicker";
import CalendarService from "../../service/CalendarService";

const CalendarFree = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // var Data = [
  //   { id: "1", date: "20/05/2022", timeStart: "10:00", timeEnd: "11:00" },
  //   { id: "2", date: "20/05/2022", timeStart: "10:00", timeEnd: "11:00" },
  //   { id: "3", date: "20/05/2022", timeStart: "10:00", timeEnd: "11:00" },
  //   { id: "4", date: "20/05/2022", timeStart: "10:00", timeEnd: "11:00" },
  //   { id: "5", date: "20/05/2022", timeStart: "10:00", timeEnd: "11:00" }, 
  // ];

  const [Data, setData] = useState([]);
  const [timeEvent, setTimeEvent] = useState("5");
  const [categoryTime, setCategoryTime] = useState("2");

  const [isCheckSelectAllDay, setIsCheckSelectAllDay] = useState(true);
  const [isCheckSelectCustom, setIsCheckSelectCustom] = useState(false);

  const [timeStart, setTimeStart] = useState(new Date());
  const [showTimeStart, setShowTimeStart] = useState(false);
  const [textTimeStart, setTextTimeStart] = useState("Từ");
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [showTimeEnd, setShowTimeEnd] = useState(false);
  const [textTimeEnd, setTextTimeEnd] = useState("Đến");

  const [dateStart, setDateStart] = useState(new Date());
  const [showDateStart, setShowDateStart] = useState(false);
  const [textDateStart, setTextDateStart] = useState("Từ");
  const [dateEnd, setDateEnd] = useState(new Date());
  const [showDateEnd, setShowDateEnd] = useState(false);
  const [textDateEnd, setTextDateEnd] = useState("Đến");

  const [isCheckMoodle, setIsCheckMoodle] = useState(true);
  const [isCheckTKB, setIsCheckTKB] = useState(false);
  const [isCheckWeekend, setIsCheckWeekend] = useState(false);

  const [showResultSearch, setShowResultSearch] = useState(false);

  const onChangeTimeStart = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowTimeStart(Platform.OS === "ios");
    setTimeStart(currentDate);

    let tempDate = new Date(currentDate);

    if (tempDate.getHours() < 10 && tempDate.getMinutes() < 10) {
      fTime = "0" + tempDate.getHours() + ":0" + tempDate.getMinutes();
    } else if (tempDate.getHours() < 10) {
      fTime = "0" + tempDate.getHours() + ":" + tempDate.getMinutes();
    } else if (tempDate.getMinutes() < 10) {
      fTime = tempDate.getHours() + ":0" + tempDate.getMinutes();
    } else {
      fTime = tempDate.getHours() + ":" + tempDate.getMinutes();
    }

    setTextTimeStart(fTime);
  };

  const onChangeTimeEnd = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowTimeEnd(Platform.OS === "ios");
    setTimeEnd(currentDate);

    let tempDate = new Date(currentDate);

    if (tempDate.getHours() < 10 && tempDate.getMinutes() < 10) {
      fTime = "0" + tempDate.getHours() + ":0" + tempDate.getMinutes();
    } else if (tempDate.getHours() < 10) {
      fTime = "0" + tempDate.getHours() + ":" + tempDate.getMinutes();
    } else if (tempDate.getMinutes() < 10) {
      fTime = tempDate.getHours() + ":0" + tempDate.getMinutes();
    } else {
      fTime = tempDate.getHours() + ":" + tempDate.getMinutes();
    }

    setTextTimeEnd(fTime);
  };
  const onChangeDateStart = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowDateStart(Platform.OS === "ios");

    setDateStart(currentDate);

    let tempDate = new Date(currentDate);
    let fDate;

    if (tempDate.getDate() < 10 && tempDate.getMonth() < 10) {
      fDate =
        "0" +
        tempDate.getDate() +
        "/0" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
    } else if (tempDate.getDate() < 10 && tempDate.getMonth() > 10) {
      fDate =
        "0" +
        tempDate.getDate() +
        "/" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
    } else if (tempDate.getMonth() < 10) {
      fDate =
        tempDate.getDate() +
        "/0" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
    } else {
      fDate =
        tempDate.getDate() +
        "/" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
    }

    setTextDateStart(fDate);
  };
  const onChangeDateEnd = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowDateEnd(Platform.OS === "ios");

    setDateEnd(currentDate);

    let tempDate = new Date(currentDate);
    let fDate;

    if (tempDate.getDate() < 10 && tempDate.getMonth() < 10) {
      fDate =
        "0" +
        tempDate.getDate() +
        "/0" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
    } else if (tempDate.getDate() < 10 && tempDate.getMonth() > 10) {
      fDate =
        "0" +
        tempDate.getDate() +
        "/" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
    } else if (tempDate.getMonth() < 10) {
      fDate =
        tempDate.getDate() +
        "/0" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
    } else {
      fDate =
        tempDate.getDate() +
        "/" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
    }

    setTextDateEnd(fDate);
  };
  const [selectedIndex, setSelectedIndex] = useState(-1);
  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        className={`h-12 justify-center items-start px-2 ${
          index === selectedIndex ? "bg-yellow-300" : "bg-white"
        } `}
        onPress={() => setSelectedIndex(index)}
      >
        <Text className="font-medium text-base">{item.date}</Text>
        <Text>
          {item.timeStart} - {item.timeEnd}
        </Text>
      </TouchableOpacity>
    );
  };
  const handleAddButtonCalendar = () => {
    setShowResultSearch(false);
    if (selectedIndex !== -1) {
      const selectedItem = Data[selectedIndex];
      console.log("Mục đã chọn:", selectedItem);
      navigation.navigate("Calendar_Add", { selectedItem });
    }
  };

  async function filterSearch(){
    console.log("==================NEED TO DO VALIDATE BELOW HERE========================\n")
    var durationTime = parseInt(timeEvent);
    if(categoryTime == "1"){
      durationTime = durationTime*60;
    } else if(categoryTime == "2"){
      durationTime = durationTime*60*60;
    } else{
      durationTime = durationTime*60*60*24;
    }  
    console.log("Thời lượng: ", durationTime); 
    var fromTime, toTime, fromDate, toDate;     
    if(isCheckSelectAllDay){    
      fromTime = "00:00"; 
      toTime = "00:00";
    } else{
      fromTime = textTimeStart;
      toTime = textTimeEnd;
    }
    fromDate = textDateStart;
    toDate = textDateEnd;
    
    console.log("Khoảng thời gian tìm kiếm: ", fromTime, toTime); 
    console.log("Ngày tìm kiếm: ", fromDate, textDateEnd);
    console.log("Bỏ qua ngày có moodle: ", isCheckMoodle);  
    console.log("Bỏ qua ngày có TKB: ", isCheckTKB);
    var filterData = await CalendarService.findFreeCalendar(durationTime, fromTime, toTime, fromDate, toDate, isCheckMoodle, isCheckTKB);
    setData(filterData);
    console.log("filterData: ", filterData);
    setShowResultSearch(true);  
  }
 
  return (
    <TouchableWithoutFeedback>
      {/* Thanh bar tiêu đề và điều hướng */}
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-15">
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left" 
                size={28}          
                color="white"
              />
            </TouchableOpacity>
            <View>
              <Text className="text-white text-xl font-medium">
                Gợi ý lịch rảnh
              </Text>
            </View>
            <View className="w-7 h-7"></View>

            {/* Phần tiêu đề */}
          </View>
        </View>
        <ScrollView className=" bg-[#F1F5F9]">
          <View className="px-4 pt-4 space-y-2">
            <Text className="text-base">Thời lượng</Text>
            <View className="flex-row justify-between items-center space-x-[2%]">
              <TextInput
                keyboardType="numeric"
                className=" bg-[#FFFFFF] px-4 py-2 rounded-lg w-[49%] text-base"
                style={{
                  shadowColor: "#000000",
                  shadowOffset: { width: 10, height: 10 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 10,
                }}
                value={timeEvent} 
                onChangeText={(text) => setTimeEvent(text)}
              ></TextInput>   
              <Dropdown
                style={{
                  backgroundColor: "#FFFFFF",
                  height: 44,
                  borderRadius: 8,
                  shadowColor: "#000000",
                  shadowOffset: { width: 10, height: 10 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 10,
                  flex: 1,
                }}
                containerStyle={{
                  borderRadius: 8,
                }}
                itemContainerStyle={{
                  borderRadius: 8,
                  height: 48,
                }}
                itemTextStyle={{
                  height: 48,
                }}
                placeholderStyle={{
                  fontSize: 16,
                  paddingLeft: 16,
                  color: "#C7C7CD",
                }}
                selectedTextStyle={{ fontSize: 16, paddingLeft: 16 }}
                iconStyle={{ marginRight: 16 }}
                data={DataCategoriTimeNoti}
                maxHeight={200}
                labelField="key"
                valueField="value"
                placeholder="Thời gian thông báo"
                value={categoryTime}
                onChange={(item) => {
                  setCategoryTime(item.value);
                }}
              />
            </View>
            <Text className="text-base">Khoảng thời gian tìm kiếm</Text>
            <View
              className="bg-white py-3 px-4 rounded-xl space-y-2"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <View className="flex-row items-center justify-start space-x-2">
                <TouchableOpacity
                  onPress={() => {
                    setIsCheckSelectAllDay(!isCheckSelectAllDay);
                    setIsCheckSelectCustom(!isCheckSelectCustom);
                  }}
                >
                  {isCheckSelectAllDay ? (
                    <MaterialCommunityIcons
                      name="circle-slice-8"
                      size={20}
                      color="black"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="circle-outline"
                      size={20}
                      color="black"
                    />
                  )}
                </TouchableOpacity>
                <Text className="text-base">Cả ngày</Text>
              </View>

              <View className="flex-row items-center justify-start space-x-2">
                <TouchableOpacity
                  onPress={() => {
                    setIsCheckSelectCustom(!isCheckSelectCustom);
                    setIsCheckSelectAllDay(!isCheckSelectAllDay);
                  }}
                >
                  {isCheckSelectCustom ? (
                    <MaterialCommunityIcons
                      name="circle-slice-8"
                      size={20}
                      color="black"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="circle-outline"
                      size={20}
                      color="black"
                    />
                  )}
                </TouchableOpacity>
                <Text className="text-base">Tùy chỉnh</Text>
              </View>
              {isCheckSelectCustom ? (
                <View className="flex-row justify-between items-center space-x-2">
                  <TouchableOpacity
                    onPress={() => setShowTimeStart(true)}
                    className="bg-white py-[6px] rounded-lg justify-center items-center border-[1px] border-[#E0E0E0] flex-1"
                  >
                    <Text className="text-base">{textTimeStart}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowTimeEnd(true)}
                    className="bg-white py-[6px] rounded-lg justify-center items-center border-[1px] border-[#E0E0E0] flex-1"
                  >
                    <Text className="text-base">{textTimeEnd}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <></>
              )}
              {showTimeStart ? (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={timeStart}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeTimeStart}
                />
              ) : showTimeEnd ? (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={timeEnd}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeTimeEnd}
                />
              ) : (
                <></>
              )}
            </View>
            <Text className="text-base">Khoảng ngày tìm kiếm</Text>
            <View className="flex-row justify-between items-center space-x-[2%]">
              <TouchableOpacity
                onPress={() => setShowDateStart(true)}
                className="bg-white w-[49%] py-2 rounded-lg justify-center items-center border-[1px] border-[#E0E0E0]"
                style={{
                  shadowColor: "#000000",
                  shadowOffset: { width: 10, height: 10 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 10,
                }}
              >
                <Text className="text-base">{textDateStart}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowDateEnd(true)}
                className="bg-white w-[49%] py-2 rounded-lg justify-center items-center border-[1px] border-[#E0E0E0]"
                style={{
                  shadowColor: "#000000",
                  shadowOffset: { width: 10, height: 10 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 10,
                }}
              >
                <Text className="text-base">{textDateEnd}</Text>
              </TouchableOpacity>
              {showDateStart ? (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateStart}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeDateStart}
                />
              ) : showDateEnd ? (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateEnd}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeDateEnd}
                />
              ) : (
                <></>
              )}
            </View>
            <View className="h-2"></View>
            <View className="flex-row items-center justify-start space-x-4">
              <TouchableOpacity
                onPress={() => {
                  setIsCheckMoodle(!isCheckMoodle);
                }}
              >
                {isCheckMoodle ? (
                  <MaterialCommunityIcons
                    name="checkbox-outline"
                    size={22}
                    color="black"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="checkbox-blank-outline"
                    size={22}
                    color="black"
                  />
                )}
              </TouchableOpacity>
              <Text className="text-base">Bỏ qua ngày có sự kiện moodle</Text>
            </View>
            <View className="flex-row items-center justify-start space-x-4">
              <TouchableOpacity
                onPress={() => {
                  setIsCheckTKB(!isCheckTKB);
                }}
              >
                {isCheckTKB ? (
                  <MaterialCommunityIcons
                    name="checkbox-outline"
                    size={22}
                    color="black"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="checkbox-blank-outline"
                    size={22}
                    color="black"
                  />
                )}
              </TouchableOpacity>
              <Text className="text-base">Không kiểm tra TKB</Text>
            </View>
            <View className="flex-row items-center justify-start space-x-4">
              <TouchableOpacity
                onPress={() => {
                  setIsCheckWeekend(!isCheckWeekend);
                }}
              >
                {isCheckWeekend ? (
                  <MaterialCommunityIcons
                    name="checkbox-outline"
                    size={22}
                    color="black"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="checkbox-blank-outline"
                    size={22}
                    color="black"
                  />
                )}
              </TouchableOpacity>
              <Text className="text-base">Ưu tiên ngày cuối tuần</Text>
            </View>
            <View className="h-2"></View>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => filterSearch()}
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
            Tìm kiếm
          </Text>
        </TouchableOpacity>
        {showResultSearch && (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View className="bg-white w-[80%] p-3 rounded-xl space-y-2">
              <View className="flex-row justify-between items-center">
                <View className="w-6 h-6"></View>
                <Text className="text-center text-lg font-semibold">
                  Lịch rảnh
                </Text>
                <TouchableOpacity onPress={() => setShowResultSearch(false)}>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              <View className="h-48">
                <FlatList
                  data={Data}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={this.renderItem}
                />
              </View>
              <TouchableOpacity
                onPress={handleAddButtonCalendar}
                className="py-2 justify-center items-center rounded-xl bg-[#3A4666]"
                style={{
                  shadowColor: "#000000",
                  shadowOffset: { width: 5, height: 5 },
                  shadowOpacity: 0.5,
                  shadowRadius: 5,
                  elevation: 5,
                }}
              >
                <Text className="font-semibold text-base text-white">
                  Thêm vào lịch
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CalendarFree;
