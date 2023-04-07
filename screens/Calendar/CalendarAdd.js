import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Switch,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import CalendarService from "../../service/CalendarService";
import moment from "moment";

const Calendar_Add = ({ selectedDay }) => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isNotified, setIsNotified] = useState(true);

  console.log("aa", selectedDay);

  // const selectedDay = props.currentDate;
  const DaySelected = moment(selectedDay, "YYYY-MM-DD").format("DD/MM/YYYY");
  console.log("aaa", DaySelected);

  const [textDate, setDateText] = useState(DaySelected);
  const [textTime, setTimeDate] = useState("00:00");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const onChange = () => {
    const currentDate = date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    console.log(currentDate);
    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    let fTime = tempDate.getHours() + ":" + tempDate.getMinutes();
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

  const handleAddingUserCalendar = async () => {
    if (title === "") {
      Alert.alert(
        "Lỗi thêm thông tin",
        "Vui lòng nhập tiêu đề cho sự kiện mới"
      );
    } else {
      console.log("Start addingg");
      try {
        await CalendarService.addUserCalendar(
          title,
          textDate,
          textTime,
          content,
          isNotified
        );
        navigation.navigate("BottomBar", {
          screen: "Calendar",
          params: {
            screenCalendar: "AddToMain",
          },
        });
      } catch (error) {
        console.log("Fail due too: ", error);
      }
    }
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
              <Text className="text-white text-xl">Thêm sự kiện mới</Text>
            </View>
            <TouchableOpacity onPress={handleAddingUserCalendar}>
              <MaterialCommunityIcons name="check" size={30} color="white" />
            </TouchableOpacity>

            {/* Phần tử rỗng để căn chỉnh phần tử thứ hai với phần tử đầu tiên
        {/* Phần tiêu đề */}
          </View>
        </View>
        <ScrollView className="bg-[#F1F5F9] h-full">
          <View className="px-5 pt-[4%] space-y-2">
            <View className="space-y-2">
              <View className="flex-row">
                <Text className="text-base">Tiêu đề</Text>
                <Text className="text-base text-red-600"> (*)</Text>
              </View>
              <TextInput
                placeholder="Tiêu đề"
                className="w-[100%] h-12 bg-[#FFFFFF] pl-4 border-2 border-solid border-[#3A4666] rounded-[8px] resize-none"
                value={title}
                onChangeText={(text) => setTitle(text)}
              ></TextInput>
            </View>
            <View className="flex-row items-center">
              <View className="space-y-2 w-[50%]">
                <View className="flex-row">
                  <Text className="text-base">Ngày</Text>
                  <Text className="text-base text-red-600"> (*)</Text>
                </View>
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
                <View className="flex-row">
                  <Text className="text-base">Giờ</Text>
                  <Text className="text-base text-red-600"> (*)</Text>
                </View>
                <TouchableOpacity onPress={() => showMode("time")}>
                  <View className="w-[140px] h-[50px] bg-[#FFFFFF] border-2 border-solid border-gray-400 text-base rounded-[4px] justify-center items-end px-2">
                    <View className="flex-row justify-center items-center space-x-4">
                      <Text className="text-base text-gray-400">
                        {textTime}
                      </Text>
                      <AntDesign name="clockcircleo" size={25} color="black" />
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
            <View className="space-y-2">
              <Text className="text-base">Ghi chú</Text>
              <TextInput
                placeholder="Nội dung"
                className="w-[100%] h-72 bg-[#FFFFFF] px-4 pt-4 border-2 border-solid border-gray-400 text-base rounded-[8px] resize-none"
                multiline={true}
                value={content}
                numberOfLines={8}
                onChangeText={(text) => setContent(text)}
                textAlignVertical="top"
              ></TextInput>
              {/* Nút thêm */}
            </View>
            <TouchableOpacity
              onPress={handleAddingUserCalendar}
              className="bg-[#3A4666] rounded-2xl flex items-center justify-center h-[5%] w-[90%] ml-[5%]"
            >
              <Text className="text-white text-center font-bold text-xl">
                Lưu
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Calendar_Add;
