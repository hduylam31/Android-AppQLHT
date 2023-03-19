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
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const CategoryButton = ({ label, onPress, selected }) => (
  <TouchableOpacity
    className={`p-1 mx-2 rounded-[8px] border-2  ${
      selected ? "border-[#3A4666]" : "border-[#FFFFFF]"
    } ${label === "profile" ? "bg-[#DBECF6]" : ""}
      ${label === "dashboard" ? "bg-[#E7E2F3]" : ""}
      ${label === "Trophy" ? "bg-[#FEF5D3]" : ""}}
      ${label === "ellipsis1" ? "bg-[#FEF5D3]" : ""}`}
    onPress={onPress}
  >
    <View className="w-[40px] h-[40px] items-center justify-center">
      <AntDesign name={label} size={25} color="black" />
    </View>
  </TouchableOpacity>
);

const LockedView = ({ isLocked, children }) => {
  return (
    <View
      className={`space-y-2 w-[50%] ${isLocked ? "" : "opacity-40"}`}
      pointerEvents={isLocked ? "auto" : "none"}
    >
      {children}
    </View>
  );
};

const TodoList_Edit = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

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

  const AlertDelete = () => {
    Alert.alert(
      "Xóa doanh mục",
      "Xóa doanh mục khỏi danh sách công việc này ?",
      [
        {
          text: "Đồng ý",
          onPress: () => {
            console.log("Yes Pressed"), navigation.goBack();
          },
        },
        {
          text: "Hủy",
          onPress: () => {
            console.log("No Pressed");
          },
        },
      ]
      // {
      //   Style: ""
      // }
    );
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
            <Text className="text-white text-xl">Chỉnh sửa công việc</Text>
          </View>
          <TouchableOpacity onPress={AlertDelete}>
            <AntDesign name="delete" size={25} color="white" />
          </TouchableOpacity>
          {/* Phần tiêu đề */}
        </View>
        <View className="bg-[#F1F5F9] flex-1 px-5 pt-[4%] space-y-4 h-full">
          <View className="space-y-2">
            <Text className="text-base">Tiêu đề</Text>
            <TextInput
              placeholder="Tiêu đề"
              className="w-[100%] h-12 bg-[#FFFFFF] text-base pl-4 border-2 border-solid border-[#3A4666] rounded-[8px] resize-none"
            ></TextInput>
          </View>
          {/* Phần phân loại */}
          <View className="pt-2 flex-row items-center">
            <Text className="text-base mr-8">Phân loại</Text>
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
          <View className="flex-row items-center">
            <LockedView isLocked={isLocked}>
              <Text className="text-base">Giờ</Text>
              <TouchableOpacity onPress={() => showMode("time")}>
                <View className="w-[140px] h-[50px] bg-[#FFFFFF] border-2 border-solid border-gray-400 text-base rounded-[4px] justify-center items-end px-2">
                  <View className="flex-row justify-center items-center space-x-4">
                    <Text className="text-base text-gray-400">{textTime}</Text>
                    <AntDesign name="clockcircleo" size={25} color="black" />
                  </View>
                </View>
              </TouchableOpacity>
            </LockedView>
            <View className="space-y-2 w-[50%] items-start">
              <Text className="text-base">Bật thông báo</Text>
              <Switch
                trackColor={{ false: "grey", true: "green" }}
                thumbColor={isLocked ? "#f4f3f4" : "#f4f3f4"}
                value={isLocked}
                onValueChange={(newValue) => setIsLocked(newValue)}
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
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
              className="w-[100%] h-[40%] bg-[#FFFFFF] px-4 pt-4 border-2 border-solid border-gray-400 text-base rounded-[8px] resize-none mb-4"
              multiline={true}
              value={value}
              numberOfLines={4}
              onChangeText={onChangeText}
              textAlignVertical="top"
            ></TextInput>

            <TouchableOpacity
              onPress={{}}
              className="bg-[#3A4666] rounded-2xl flex basis-1/12 items-center justify-center"
            >
              <Text className="text-white text-center font-bold text-xl">
                Lưu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default TodoList_Edit;
