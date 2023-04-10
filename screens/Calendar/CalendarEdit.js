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
      className="px-5 pt-[4%] space-y-2"
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
    if (title === "") {
      Alert.alert(
        "Lỗi cập nhật thông tin",
        "Tiêu đề không được để trống vui lòng nhập tiêu đề"
      );
    } else {
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

  console.log(item.isMoodle);

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
            {item.isMoodle === "false" ? (
              <Text className="text-white text-xl">Cập nhật sự kiện</Text>
            ) : (
              <Text className="text-white text-xl">Xem thông tin sự kiện</Text>
            )}

            {item.isMoodle === "false" ? (
              <TouchableOpacity onPress={AlertDelete}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={30}
                  color="white"
                />
              </TouchableOpacity>
            ) : (
              <View className="w-8 h-8"></View>
            )}
          </View>
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
              className="w-[100%] h-12 bg-[#FFFFFF] pl-4 rounded-lg resize-none text-base "
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
            ></TextInput>

            <View className="flex-row justify-between items-center">
              <View className="space-y-2 w-[49%]">
                <View className="flex-row">
                  <Text className="text-base">Ngày</Text>
                  <Text className="text-base text-red-600"> (*)</Text>
                </View>
                <TouchableOpacity onPress={() => showMode("date")}>
                  <View
                    className=" bg-[#FFFFFF] h-12 flex-row rounded-lg justify-between items-center px-3"
                    style={{
                      shadowColor: "#000000",
                      shadowOffset: { width: 10, height: 10 },
                      shadowOpacity: 0.5,
                      shadowRadius: 10,
                      elevation: 10,
                    }}
                  >
                    <Text className="text-base ">{textDate}</Text>
                    <AntDesign name="calendar" size={25} color="black" />
                  </View>
                </TouchableOpacity>
              </View>
              <View className="space-y-2 w-[49%]">
                <View className="flex-row">
                  <Text className="text-base">Giờ</Text>
                  <Text className="text-base text-red-600"> (*)</Text>
                </View>
                <TouchableOpacity onPress={() => showMode("time")}>
                  <View
                    className="bg-[#FFFFFF] h-12 flex-row rounded-lg justify-between items-center px-3 "
                    style={{
                      shadowColor: "#000000",
                      shadowOffset: { width: 10, height: 10 },
                      shadowOpacity: 0.5,
                      shadowRadius: 10,
                      elevation: 10,
                    }}
                  >
                    <Text className="text-base">{textTime}</Text>
                    <AntDesign name="clockcircleo" size={25} color="black" />
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
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
              />
            </View>
            {/* Nội dung phần ghi chú */}
            <Text className="text-base">Ghi chú</Text>
            <TextInput
              placeholder="Nội dung"
              className="w-[100%] h-72 bg-[#FFFFFF] px-4 pt-4  text-base rounded-lg resize-none"
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
            ></TextInput>
          </LockedView>
          {/* Nút thêm */}
          {item.isMoodle === "false" ? (
            <TouchableOpacity
              onPress={handleUpdateCalendar}
              className="bg-[#3A4666] rounded-2xl flex items-center justify-center mt-16 mb-6 h-10 w-[90%] ml-[5%]"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <Text className="text-white text-center font-bold text-xl">
                Lưu
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="mt-16 mb-6"></View>
          )}
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Calendar_Edit;
