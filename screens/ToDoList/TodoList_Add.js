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
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import TodolistService from "../../service/TodolistService.js";

const CategoryButton = ({ label, onPress, selected }) => (
  <TouchableOpacity
    className={`p-[1px] mx-2 rounded-[8px] border-2  ${
      selected ? "border-[#3A4666]" : "border-[#FFFFFF]"
    } ${label === "profile" ? "bg-[#DBECF6]" : ""}
      ${label === "dashboard" ? "bg-[#E7E2F3]" : ""}
      ${label === "Trophy" ? "bg-[#FEF5D3]" : ""}}
      ${label === "ellipsis1" ? "bg-[#D5EFC6]" : ""}`}
    onPress={onPress}
  >
    <View className="w-[40px] h-[40px] items-center justify-center">
      <AntDesign name={label} size={25} color="black" />
    </View>
  </TouchableOpacity>
);

const LockedView = ({ isNotified, children }) => {
  return (
    <View
      className={`w-[50%] ${isNotified ? "" : "opacity-40"}`}
      pointerEvents={isNotified ? "auto" : "none"}
    >
      {children}
    </View>
  );
};

const TodoList_Add = () => {
  const [selectedCategory, setSelectedCategory] = useState();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isNotified, setIsNotified] = useState(true);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    setSelectedCategory("profile"); // Thiết lập loại công việc mặc định là "Học tập" khi màn hình được khởi tạo
  }, []);

  const navigation = useNavigation();
  const [date, setDate] = React.useState(new Date());
  const [mode, setMode] = React.useState("date");
  const [show, setShow] = React.useState(false);
  const [textDate, setDateText] = React.useState(
    new Date().toLocaleDateString()
  );
  const [textTime, setTimeDate] = React.useState("00:00");

  const handleAddingTodolist = async () => {
    if (title === "") {
      Alert.alert(
        "Lỗi thêm thông tin",
        "Vui lòng nhập tiêu đề cho công việc mới"
      );
    } else {
      console.log("Start adding");
      try {
        // TodolistService.addTodolist
        await TodolistService.addTodolist(
          title,
          selectedCategory,
          isNotified,
          textTime,
          content
        );
        navigation.navigate("BottomBar", {
          screen: "ToDoList",
          params: {
            screenTodoList: "AddToMain",
          },
        });
      } catch (error) {
        console.log("Fail due to: ", error);
      }
    }
  };

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
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-15">
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={30} color="white" />
            </TouchableOpacity>
            <View>
              <Text className="text-white text-xl">Thêm ghi chú mới</Text>
            </View>
            <View className="w-8 h-8"></View>
          </View>
        </View>
        <View className="bg-[#F1F5F9] px-5 pt-[4%] space-y-2 h-full">
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
          {/* Phần phân loại */}
          <View className="pt-2 flex-row items-center">
            <Text className="text-base mr-4 mb-3">Phân loại</Text>
            <View className="justify-center items-center">
              <CategoryButton
                label="profile"
                onPress={() => handleCategoryPress("profile")}
                selected={selectedCategory === "profile"}
              />
              <Text className="text-sm">Học tập</Text>
            </View>
            <View className="justify-center items-center">
              <CategoryButton
                label="dashboard"
                onPress={() => handleCategoryPress("dashboard")}
                selected={selectedCategory === "dashboard"}
              />
              <Text className="text-sm">Sự kiện</Text>
            </View>
            <View className="justify-center items-center">
              <CategoryButton
                label="Trophy"
                onPress={() => handleCategoryPress("Trophy")}
                selected={selectedCategory === "Trophy"}
              />
              <Text className="text-sm">Giải trí</Text>
            </View>
            <View className="justify-center items-center">
              <CategoryButton
                label="ellipsis1"
                onPress={() => handleCategoryPress("ellipsis1")}
                selected={selectedCategory === "ellipsis1"}
              />
              <Text className="text-sm">Khác</Text>
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-base">Giờ</Text>
            <Text className="text-base mr-[20%]">Bật thông báo</Text>
          </View>
          <View className="flex-row items-center">
            <LockedView isNotified={isNotified}>
              <TouchableOpacity onPress={() => showMode("time")}>
                <View className="w-[140px] h-[50px] bg-[#FFFFFF] border-2 border-solid border-gray-400 text-base rounded-[4px] justify-center items-end px-2">
                  <View className="flex-row justify-center items-center space-x-4">
                    <Text className="text-base text-gray-400">{textTime}</Text>
                    <AntDesign name="clockcircleo" size={25} color="black" />
                  </View>
                </View>
              </TouchableOpacity>
            </LockedView>
            <View className="items-start w-[50%]">
              <Switch
                trackColor={{ false: "grey", true: "#3A4666" }}
                thumbColor={isNotified ? "#f4f3f4" : "#f4f3f4"}
                value={isNotified}
                onValueChange={(newValue) => setIsNotified(newValue)}
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
              ></Switch>
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
              className="w-[100%] h-60 bg-[#FFFFFF] px-4 pt-4 border-2 border-solid border-gray-400 text-base rounded-[8px] resize-none mb-4"
              multiline={true}
              value={content}
              numberOfLines={4}
              onChangeText={(text) => setContent(text)}
              textAlignVertical="top"
            ></TextInput>
          </View>
          {/* Button thêm */}
          <TouchableOpacity
            onPress={handleAddingTodolist}
            className="bg-[#3A4666] rounded-2xl h-[5%] w-[90%] ml-[5%] items-center justify-center"
          >
            <Text className="text-white text-center font-bold text-xl">
              Lưu
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default TodoList_Add;
