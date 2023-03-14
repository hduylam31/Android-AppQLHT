import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Button,
  Platform,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import TodolistService from "../service/TodolistService.js";

const CategoryButton = ({ label, onPress, selected }) => (
  <TouchableOpacity
    className={`p-1 mx-2 rounded-[8px] border-2  ${
      selected ? "border-[#3A4666]" : "border-[#FFFFFF]"
    } ${label === "profile" ? "bg-[#DBECF6]" : ""}
      ${label === "dotchart" ? "bg-[#E7E2F3]" : ""}
      ${label === "Trophy" ? "bg-[#FEF5D3]" : ""}`}
    onPress={onPress}
  >
    <View className="w-[40px] h-[40px] items-center justify-center">
      <AntDesign name={label} size={25} color="black" />
    </View>
  </TouchableOpacity>
);

const TodoList_Add = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const handleAddingTodolist = () => {
    console.log("Start adding");
    try {
      TodolistService.addTodolist(title, selectedCategory, textDate, textTime, value);
      console.log("Done adding")
      navigation.goBack()
      console.log("Done navigation")
    } catch (error) {
      console.log("Fail due to: ", error);
    }
  }

  const navigation = useNavigation();
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

  const [value, setValue] = useState("");

  const onChangeText = (text) => {
    setValue(text);
  };

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

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      {/* Thanh bar tiêu đề và điều hướng */}
      <SafeAreaView className="bg-[#3A4666]">
        <View className="flex-row justify-between items-center p-4 flex-1 h-[12%]">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View className="mt-[7%] ml-[3%]">
              <AntDesign name="arrowleft" size={30} color="white" />
            </View>
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl">Thêm công việc mới</Text>
          </View>
          <View className="w-25 h-25"></View>
          {/* Phần tử rỗng để căn chỉnh phần tử thứ hai với phần tử đầu tiên */}
          {/* Phần tiêu đề */}
        </View>
        <View className="bg-[#F1F5F9] flex-1 px-5 pt-[4%] space-y-4 h-full">
          <View className="space-y-2">
            <Text className="text-base">Tiêu đề</Text>
            <TextInput
              placeholder="Tiêu đề"
              className="w-[100%] h-12 bg-[#FFFFFF] pl-4 border-2 border-solid border-[#3A4666] rounded-[8px] resize-none"
              value = {title}
              onChangeText={(text) => setTitle(text)}
            ></TextInput>
          </View>
          {/* Phần phân loại */}
          <View className="pt-4 flex-row items-center">
            <Text className="text-base mr-8">Phân loại</Text>
            <CategoryButton
              label="profile"
              onPress={() => handleCategoryPress("profile")}
              selected={selectedCategory === "profile"}
            />
            <CategoryButton
              label="dotchart"
              onPress={() => handleCategoryPress("dotchart")}
              selected={selectedCategory === "dotchart"}
            />
            <CategoryButton
              label="Trophy"
              onPress={() => handleCategoryPress("Trophy")}
              selected={selectedCategory === "Trophy"}
            />
            <View className="flex-row space-x-4"></View>
          </View>
          <View className="flex-row items-center">
            <View className="space-y-2 w-[50%]">
              <Text className="text-base">Ngày</Text>
              <TouchableOpacity onPress={() => showMode("date")}>
                <View className="w-[140px] h-[50px] bg-[#FFFFFF] border-2 border-solid border-gray-400 text-base rounded-[4px] justify-center items-end px-2">
                  <View className="flex-row justify-center items-center space-x-4">
                    <Text className="text-base text-gray-400">{textDate}</Text>
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
                    <Text className="text-base text-gray-400">{textTime}</Text>
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
          {/* Nội dung phần ghi chú */}
          <View className="space-y-2">
            <Text className="text-base">Ghi chú</Text>
            <TextInput
              placeholder="Nội dung"
              className="w-[100%] h-[55%] bg-[#FFFFFF] px-4 pt-4 border-2 border-solid border-gray-400 text-base rounded-[8px] resize-none"
              multiline={true}
              value={value}
              numberOfLines={4}
              onChangeText={onChangeText}
              textAlignVertical="top"
            ></TextInput>

            {/* Làm tạm nút thêm */}
            <TouchableOpacity onPress={handleAddingTodolist}
            className="bg-[#3A4666] rounded-2xl flex basis-1/12 items-center justify-center">
              <Text className="text-white text-center font-bold text-xl">
                Thêm công việc
              </Text>
            </TouchableOpacity>
            {/* Kết thúc Làm tạm nút thêm */}

          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default TodoList_Add;