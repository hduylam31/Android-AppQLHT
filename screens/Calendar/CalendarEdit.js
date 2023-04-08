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

const LockedView = ({ isMoodle, children }) => {
  return (
    <View
      pointerEvents={isMoodle === "false" ? "auto" : "none"}
      className="space-y-2"
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

  const [date, setDate] = React.useState(new Date());
  const [mode, setMode] = React.useState("date");
  const [show, setShow] = React.useState(false);
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

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    if (tempDate.getHours() < 10 && tempDate.getMinutes() < 10) {
      fTime = "0" + tempDate.getHours() + ":0" + tempDate.getMinutes();
    } else if (tempDate.getHours() < 10) {
      fTime = "0" + tempDate.getHours() + ":" + tempDate.getMinutes();
    } else if (tempDate.getMinutes() < 10) {
      fTime = tempDate.getHours() + ":0" + tempDate.getMinutes();
    } else {
      fTime = tempDate.getHours() + ":" + tempDate.getMinutes();
    }
    setDateText(fDate);
    setTimeDate(fTime);

    console.log(fDate + " (" + fTime + ")");
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const handlePress = () => {
    Keyboard.dismiss();
  };

  const route = useRoute();
  const item = route.params.item;

  useEffect(() => {
    const loadData = () => {
      setTitle(item.title);
      setTimeDate(item.timeString);
      const date = new Date(item.dateString);
      const dateFormat = date.toLocaleDateString("vi-VN");
      setDateText(dateFormat);
      setContent(item.description);
      setIsNotified(item.isNotified);
    };
    loadData();
  }, []);

  const handleUpdateCalendar = async () => {
    console.log("Start update");
    try {
      const newItem = {
        id: item.id,
        title,
        textDate,
        textTime,
        content,
        isNotified,
        content,
        isMoodle: item.isMoodle,
      };
      console.log("new Item: ", newItem);
      console.log("Old Item: ", item);
      await CalendarService.updateUserCalendar(newItem, item);
      navigation.navigate("BottomBar", {
        screen: "Calendar",
        params: {
          screenCalendar: "EditToMain",
        },
      });
    } catch (error) {
      console.log("Fail due to: ", error);
    }
  };

  const handleDeleteCalendar = async () => {
    console.log("Start delete");
    try {
      await CalendarService.deleteCalendar(item);
      navigation.navigate("BottomBar", {
        screen: "Calendar",
        params: {
          screenCalendar: "DeleteToMain",
        },
      });
    } catch (error) {
      console.log("Fail due to: ", error);
    }
  };

  const AlertDelete = () => {
    Alert.alert("Xóa danh mục", "Xóa danh mục khỏi danh sách sự kiện này ?", [
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

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      {/* Thanh bar tiêu đề và điều hướng */}
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-15">
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={30}
                color="white"
              />
            </TouchableOpacity>
            <View>
              <Text className="text-white text-xl">Cập nhật sự kiện</Text>
            </View>
            <View className="flex-row">
              {/* <TouchableOpacity onPress={handleUpdateCalendar}>
                <MaterialCommunityIcons name="check" size={30} color="white" />
              </TouchableOpacity> */}
              <TouchableOpacity onPress={AlertDelete}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={30}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView className="bg-[#F1F5F9] h-full">
          <LockedView isMoodle={item.isMoodle}>
            <View className="px-5 pt-[4%] space-y-2 h-[90%]">
              <View className="space-y-2">
                <Text className="text-base">Tiêu đề</Text>
                <TextInput
                  placeholder="Tiêu đề"
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  className="w-[100%] h-12 bg-[#FFFFFF] pl-4 border-2 border-solid border-[#3A4666] rounded-[8px] resize-none"
                ></TextInput>
              </View>

              <View className="flex-row items-center">
                <View className="space-y-2 w-[50%]">
                  <Text className="text-base">Ngày</Text>
                  <TouchableOpacity onPress={() => showMode("date")}>
                    <View className="w-[140px] h-[50px] bg-[#FFFFFF] border-2 border-solid border-gray-400 text-base rounded-[4px] justify-center items-end px-2">
                      <View className="flex-row justify-center items-center space-x-4">
                        <Text className="text-base text-gray-400">
                          {textDate}
                        </Text>
                        <AntDesign name="calendar" size={25} color="black" />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View className="pl-4 space-y-2 w-[100%]">
                  <Text className="text-base">Giờ</Text>
                  <TouchableOpacity onPress={() => showMode("time")}>
                    <View className="w-[140px] h-[50px] bg-[#FFFFFF] border-2 border-solid border-gray-400 text-base rounded-[4px] justify-center items-end px-2">
                      <View className="flex-row justify-center items-center space-x-4">
                        <Text className="text-base text-gray-400">
                          {textTime}
                        </Text>
                        <AntDesign
                          name="clockcircleo"
                          size={25}
                          color="black"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                  />
                )}
              </View>
              <Text className="text-base">Bật thông báo</Text>
              <View className="items-start">
                <Switch
                  trackColor={{ false: "grey", true: "#3A4666" }}
                  thumbColor={isNotified ? "#f4f3f4" : "#f4f3f4"}
                  value={isNotified}
                  onValueChange={(newValue) => setIsNotified(newValue)}
                  style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                />
              </View>
              {/* Nội dung phần ghi chú */}
              <Text className="text-base">Ghi chú</Text>
              <TextInput
                placeholder="Nội dung"
                className="w-[100%] h-72 bg-[#FFFFFF] px-4 pt-4 border-2 border-solid border-gray-400 text-base rounded-[8px] resize-none"
                multiline={true}
                value={content}
                numberOfLines={8}
                onChangeText={(value) => setContent(value)}
                textAlignVertical="top"
              ></TextInput>
              {/* Nút thêm */}
              <TouchableOpacity
                onPress={handleUpdateCalendar}
                className="bg-[#3A4666] rounded-2xl flex items-center justify-center h-[6%] w-[90%] ml-[5%]"
              >
                <Text className="text-white text-center font-bold text-xl">
                  Lưu
                </Text>
              </TouchableOpacity>
            </View>
          </LockedView>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Calendar_Edit;
