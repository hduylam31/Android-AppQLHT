import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";
import ScheduleService from "../../service/ScheduleService";
import BottomBar from "../BottomBar";

const Schedule_Add = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState();
  const [selectedLessonStart, setSelectedLessonStart] = useState("");
  const [selectedLessonEnd, setSelectedLessonEnd] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  const data = [
    { key: "1", value: "1" },
    { key: "1.5", value: "1.5" },
    { key: "2", value: "2" },
    { key: "2.5", value: "2.5" },
    { key: "3", value: "3" },
    { key: "3.5", value: "3.5" },
    { key: "4", value: "4" },
    { key: "4.5", value: "4.5" },
    { key: "5", value: "5" },
    { key: "5.5", value: "5.5" },
    { key: "6", value: "6" },
    { key: "6.5", value: "6.5" },
    { key: "7", value: "7" },
    { key: "7.5", value: "7.5" },
    { key: "8", value: "8" },
    { key: "8.5", value: "8.5" },
    { key: "9", value: "9" },
    { key: "9.5", value: "9.5" },
    { key: "10", value: "10" },
    { key: "10.5", value: "10.5" },
    { key: "11", value: "11" },
    { key: "11.5", value: "11.5" },
    { key: "12", value: "12" },
    { key: "12.5", value: "12.5" },
    { key: "13", value: "13" },
    { key: "13.5", value: "13.5" },
    { key: "14", value: "14" },
    { key: "14.5", value: "14.5" },
    { key: "15", value: "15" },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handlePress = () => {
    Keyboard.dismiss();
  };

  const handleAddingUserSchedule = async () => {
    console.log("Start addingg");
    try {
      await ScheduleService.addSchedule({title, "DayOfWeek": "T.2", selectedLessonStart, selectedLessonEnd, location, note});
      navigation.navigate(BottomBar);
    } catch (error) {
      console.log("Fail due to: ", error);
    }
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
              <Text className="text-white text-xl">Thêm sự kiện mới</Text>
            </View>
            <View className="w-25 h-25"></View>
            {/* Phần tử rỗng để căn chỉnh phần tử thứ hai với phần tử đầu tiên
        {/* Phần tiêu đề */}
          </View>
        </View>

        <View className="bg-[#F1F5F9] px-5 pt-[4%] space-y-4 h-full">
          <View className="space-y-2">
            <Text className="text-base">Tiêu đề</Text>
            <TextInput
              placeholder="Môn học"
              className="w-[100%] h-12 bg-[#FFFFFF] pl-4 border-2 border-solid border-[#3A4666] rounded-[8px] resize-none"
              value={title}
              onChangeText={(text) => setTitle(text)}
            ></TextInput>
          </View>
          <View className="space-y-2 top-24">
            <Text className="text-base">Địa điểm</Text>
            <TextInput
              placeholder="Địa điểm"
              className="w-[100%] h-12 bg-[#FFFFFF] pl-4 border-2 border-solid border-[#3A4666] rounded-[8px] resize-none"
              value={location}
              onChangeText={(text) => setLocation(text)}
            ></TextInput>
          </View>
          <View className="space-y-2 top-24">
            <Text className="text-base">Ghi chú</Text>
            <TextInput
              placeholder="Nội dung"
              className="w-[100%] h-[50%] bg-[#FFFFFF] px-4 pt-4 border-2 border-solid border-[#3A4666] text-base rounded-[8px] resize-none"
              multiline={true}
              value={note}
              numberOfLines={4}
              onChangeText={(text) => setNote(text)}
              textAlignVertical="top"
            ></TextInput>
          </View>
          <TouchableOpacity
            onPress={handleAddingUserSchedule}
            className="bg-[#3A4666] rounded-2xl flex items-center justify-center h-[5%] w-[90%] ml-[5%"
          >
            <Text className="text-white text-center font-bold text-xl">
              Lưu
            </Text>
          </TouchableOpacity>
          <View className="space-y-2 absolute top-24 ml-[5%] w-full">
            <Text className="text-base">Tiết</Text>
            <View className="flex-row justify-between">
              <View className="w-[45%]">
                <SelectList
                  data={data}
                  value={selectedLessonStart}
                  setSelected={setSelectedLessonStart}
                  placeholder="Từ"
                  notFoundText="Không tìm thấy kết quả"
                  searchPlaceholder="Tìm kiếm"
                  maxHeight={200}
                  boxStyles={{
                    borderColor: "#3A4666",
                    borderWidth: 2,
                    backgroundColor: "#FFFFFF",
                  }}
                  dropdownStyles={{
                    backgroundColor: "#FFFFFF",
                    width: "100%",
                  }}
                />
              </View>
              <View className="w-[45%]">
                <SelectList
                  data={data}
                  value={selectedLessonEnd}
                  setSelected={setSelectedLessonEnd}
                  placeholder="Đến"
                  notFoundText="Không tìm thấy kết quả"
                  searchPlaceholder="Tìm kiếm"
                  maxHeight={200}
                  boxStyles={{
                    borderColor: "#3A4666",
                    borderWidth: 2,
                    backgroundColor: "#FFFFFF",
                  }}
                  dropdownStyles={{
                    top: 50,
                    backgroundColor: "#FFFFFF",
                    width: "100%",
                    position: "absolute",
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Schedule_Add;
