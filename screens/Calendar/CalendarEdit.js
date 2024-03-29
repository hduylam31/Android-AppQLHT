import { DataTimeNoti, DataCategoriTimeNoti } from "./DataOfDropDown";
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
  Alert,
  Switch,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import CalendarService from "../../service/CalendarService";
import { Dropdown } from "react-native-element-dropdown";

const LockedView = ({ isMoodle, children }) => {
  return (
    <View
      pointerEvents={isMoodle === "false" ? "auto" : "none"}
      className="px-4 pt-[4%] space-y-2"
    >
      {children}
    </View>
  );
};

const Calendar_Edit = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isNotified, setIsNotified] = useState("");

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const [textDate, setDateText] = React.useState(
    new Date().toLocaleDateString()
  );
  const [textTime, setTimeDate] = React.useState(
    new Date().toLocaleTimeString()
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowDate(Platform.OS === "ios");

    setDate(currentDate);
    console.log("currentDate", currentDate);
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

    setDateText(fDate);

    console.log(fDate + " (" + fTime + ")");
  };

  const onChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowTime(Platform.OS === "ios");
    setTime(currentDate);
    console.log("currentDate", currentDate);
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

    setTimeDate(fTime);

    console.log(fDate + " (" + fTime + ")");
  };

  const handlePress = () => {
    Keyboard.dismiss();
  };

  const route = useRoute();
  const item = route.params.item;

  useEffect(() => {
    const loadData = () => {
      console.log("item: ", item);
      setTitle(item.title);
      setTimeDate(item.timeString);
      const date = new Date(item.dateString);
      const dateFormat = date.toLocaleDateString("vi-VN");
      setDateText(dateFormat);
      setContent(item.description);
      setIsNotified(item.isNotified);
      if (item.isNotified) {
        setTimeNoti(item.rangeTimeInfo.type);
        setCustomTimeNoti(item.rangeTimeInfo.customType);
        setNumberTimeNoti(item.rangeTimeInfo.customTime);
      }
      setTimeEvent(item.rangeTimeInfo.durationTime);
      setCategoryTime(item.rangeTimeInfo.durationType);
    };
    loadData();
  }, []);

  const handleUpdateCalendar = async () => {
    if (title === "") {
      Alert.alert(
        "Lỗi cập nhật thông tin",
        "Tiêu đề không được để trống vui lòng nhập tiêu đề"
      );
    } else {
      console.log("Start update");
      try {
        var rangeTimeInfo = {
          time: "0",
          type: "",
          customType: "",
          customTime: "",
        };
        if (isNotified) {
          var rangeTime = -1;
          if (timeNoti == "1") rangeTime = 0;
          if (timeNoti == "2") rangeTime = 5 * 60;
          if (timeNoti == "3") rangeTime = 10 * 60;
          if (timeNoti == "4") rangeTime = 60 * 60;
          if (timeNoti == "5") rangeTime = 60 * 60 * 24;
          if (timeNoti == "6") {
            switch (customTimeNoti) {
              case "1":
                rangeTime = parseInt(numberTimeNoti) * 60;
                break;
              case "2":
                rangeTime = parseInt(numberTimeNoti) * 60 * 60;
                break;
              case "3":
                rangeTime = parseInt(numberTimeNoti) * 60 * 60 * 24;
                break;
              default:
                rangeTime = 60 * 60 * 2;
                break;
            }
          }

          rangeTimeInfo = {
            time: rangeTime,
            type: timeNoti,
            customType: customTimeNoti,
            customTime: numberTimeNoti,
          };
        }

        rangeTimeInfo = {
          ...rangeTimeInfo,
          durationTime: timeEvent,
          durationType: categoryTime,
        };

        const newItem = {
          id: item.id,
          title,
          textDate,
          textTime,
          content,
          isNotified,
          content,
          isMoodle: item.isMoodle,
          rangeTimeInfo,
        };
        await CalendarService.updateUserCalendar(newItem, item);
        navigation.navigate("BottomBar", {
          screen: "Lịch",
          params: {
            screenCalendar: "EditToMain",
          },
        });
      } catch (error) {
        console.log("Fail due to: ", error);
      }
    }
  };

  const handleDeleteCalendar = async () => {
    console.log("Start delete");
    try {
      await CalendarService.deleteCalendar(item);
      navigation.navigate("BottomBar", {
        screen: "Lịch",
        params: {
          screenCalendar: "DeleteToMain",
        },
      });
    } catch (error) {
      console.log("Fail due to: ", error);
    }
  };

  const AlertDelete = () => {
    Alert.alert("Xóa sự kiện", "Xóa sự kiện này khỏi lịch?", [
      {
        text: "Đồng ý",
        onPress: handleDeleteCalendar,
      },
      {
        text: "Hủy",
        onPress: () => {
          console.log("No Pressed");
        },
      },
    ]);
  };

  //Kiểm tra bàn phím có đang xuất hiện khôngg
  const [isKeyboardShowing, setIsKeyboardShowing] = useState(false);

  const showKeyboard = () => {
    setIsKeyboardShowing(true);
  };

  const hideKeyboard = () => {
    setIsKeyboardShowing(false);
  };

  Keyboard.addListener("keyboardDidShow", showKeyboard);
  Keyboard.addListener("keyboardDidHide", hideKeyboard);

  const [timeNoti, setTimeNoti] = useState(null);
  const [customTimeNoti, setCustomTimeNoti] = useState("1");
  const [numberTimeNoti, setNumberTimeNoti] = useState("5");

  console.log("cus", customTimeNoti);
  console.log("number", numberTimeNoti);

  const [timeEvent, setTimeEvent] = useState("5");
  const [categoryTime, setCategoryTime] = useState("2");

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      {/* Thanh bar tiêu đề và điều hướng */}
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-14 flex-row justify-between items-center px-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          {item.isMoodle === "false" ? (
            <Text className="text-white text-xl font-medium">
              Cập nhật sự kiện
            </Text>
          ) : (
            <Text className="text-white text-xl font-medium">
              Xem thông tin sự kiện
            </Text>
          )}

          {item.isMoodle === "false" ? (
            <TouchableOpacity onPress={AlertDelete}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={28}
                color="white"
              />
            </TouchableOpacity>
          ) : (
            <View className="w-7 h-7"></View>
          )}
        </View>

        <ScrollView className="bg-[#F1F5F9]">
          <LockedView isMoodle={item.isMoodle}>
            <View className="flex-row">
              <Text className="text-base">Tiêu đề</Text>
              <Text className="text-base text-red-600"> (*)</Text>
            </View>
            <TextInput
              placeholder="Tiêu đề"
              value={title}
              multiline={true}
              onChangeText={(text) => setTitle(text)}
              className="w-[100%] bg-[#FFFFFF] px-4 py-3 rounded-lg resize-none text-base "
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
              editable={item.isMoodle === "true" ? false : true}
            ></TextInput>

            <View className="flex-row justify-between items-center">
              <View className="space-y-2 w-[49%]">
                <View className="flex-row">
                  <Text className="text-base">Ngày</Text>
                  <Text className="text-base text-red-600"> (*)</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowDate(true)}
                  className=" bg-[#FFFFFF] h-12 flex-row rounded-lg justify-between items-center px-3"
                  style={{
                    shadowColor: "#000000",
                    shadowOffset: { width: 10, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 10,
                  }}
                >
                  <Text
                    className={`text-base ${
                      item.isMoodle === "true"
                        ? "text-[#666666] opacity-50"
                        : ""
                    }`}
                  >
                    {textDate}
                  </Text>
                  <AntDesign name="calendar" size={25} color="black" />
                </TouchableOpacity>
              </View>
              <View className="space-y-2 w-[49%]">
                <View className="flex-row">
                  <Text className="text-base">Giờ</Text>
                  <Text className="text-base text-red-600"> (*)</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowTime(true)}
                  className="bg-[#FFFFFF] h-12 flex-row rounded-lg justify-between items-center px-3 "
                  style={{
                    shadowColor: "#000000",
                    shadowOffset: { width: 10, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 10,
                  }}
                >
                  <Text
                    className={`text-base ${
                      item.isMoodle === "true"
                        ? "text-[#666666] opacity-50"
                        : ""
                    }`}
                  >
                    {textTime}
                  </Text>
                  <AntDesign name="clockcircleo" size={25} color="black" />
                </TouchableOpacity>
              </View>

              {showDate && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeDate}
                />
              )}

              {showTime && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={time}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeTime}
                />
              )}
            </View>
            {item.isMoodle === "false" ? (
              <>
                <Text className="text-base my-2">Thời lượng</Text>
                <View className="flex-row justify-between items-center space-x-[2%] mb-2">
                  <TextInput
                    keyboardType="numeric"
                    className=" bg-[#FFFFFF] px-4 py-[10px] rounded-lg w-[49%] text-base"
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
                      height: 48,
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
                    placeholder="Thời gian"
                    value={categoryTime}
                    onChange={(item) => {
                      setCategoryTime(item.value);
                    }}
                  />
                </View>
              </>
            ) : (
              <></>
            )}
          </LockedView>

          <View className="px-4">
            <Text className="text-base">Bật thông báo</Text>
            <View className="items-start" pointerEvents="auto">
              <Switch
                trackColor={{ false: "grey", true: "#3A4666" }}
                thumbColor={isNotified ? "#f4f3f4" : "#f4f3f4"}
                value={isNotified}
                onValueChange={(newValue) => setIsNotified(newValue)}
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
              />
            </View>

            {item.isMoodle === "false" ? (
              <>
                <Text className="text-base mb-2">Thời gian thông báo</Text>
                <Dropdown
                  disable={isNotified ? false : true}
                  style={{
                    backgroundColor: "#FFFFFF",
                    height: 48,
                    borderRadius: 8,
                    shadowColor: "#000000",
                    shadowOffset: { width: 10, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 10,
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
                  data={DataTimeNoti}
                  maxHeight={200}
                  labelField="key"
                  valueField="value"
                  placeholder="Thời gian thông báo"
                  value={isNotified ? timeNoti : ""}
                  onChange={(item) => {
                    setTimeNoti(item.value);
                  }}
                />
              </>
            ) : (
              <></>
            )}
            {timeNoti === "6" && isNotified && item.isMoodle === "false" ? (
              <View className="flex-row justify-between mt-2">
                <TextInput
                  placeholder="Nhập số"
                  keyboardType="numeric"
                  className="w-[49%] bg-[#FFFFFF] px-4 py-2 rounded-lg resize-none text-base"
                  style={{
                    shadowColor: "#000000",
                    shadowOffset: { width: 10, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 10,
                  }}
                  value={numberTimeNoti}
                  onChangeText={(text) => setNumberTimeNoti(text)}
                ></TextInput>
                <Dropdown
                  style={{
                    backgroundColor: "#FFFFFF",
                    height: 48,
                    width: "49%",
                    borderRadius: 8,
                    shadowColor: "#000000",
                    shadowOffset: { width: 10, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 10,
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
                  value={customTimeNoti}
                  onChange={(item) => {
                    setCustomTimeNoti(item.value);
                  }}
                />
              </View>
            ) : (
              <View></View>
            )}
            {/* Nội dung phần ghi chú */}

            <Text className="text-base mt-2">Ghi chú</Text>
            <TextInput
              placeholder="Nội dung"
              className={`w-[100%] ${
                item.isMoodle === "true" ? "h-60" : "h-36"
              } bg-[#FFFFFF] px-4 pt-4 mt-2 text-base rounded-lg resize-none`}
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
              multiline={true}
              value={content}
              numberOfLines={8}
              onChangeText={(value) => setContent(value)}
              textAlignVertical="top"
              editable={item.isMoodle === "true" ? false : true}
            ></TextInput>
            <View className="h-20"></View>
          </View>
          {/* Nút thêm */}

          {isKeyboardShowing && item.isMoodle === "false" ? (
            <TouchableOpacity
              onPress={handleUpdateCalendar}
              className="bg-[#3A4666] rounded-2xl flex items-center justify-center mb-6 h-10 w-[90%] ml-[5%]"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <Text className="text-white text-center font-bold text-base">
                Lưu
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="mt-10 mb-6"></View>
          )}
        </ScrollView>
        {!isKeyboardShowing && item.isMoodle === "false" && (
          <View className="w-full h-16 bg-[#F1F5F9]">
            <TouchableOpacity
              onPress={handleUpdateCalendar}
              className="w-[90%] h-10 absolute bottom-6 ml-[5%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <Text className="text-white text-center font-bold text-base">
                Lưu
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Calendar_Edit;
