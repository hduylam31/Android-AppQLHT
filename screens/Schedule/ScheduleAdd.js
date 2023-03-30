import { lessons, weekdays } from "./DataOfDropDown";
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

const Schedule_Add = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState();
  const [DayOfWeek, setDayOfWeek] = useState();
  const [selectedLessonStart, setSelectedLessonStart] = useState("");
  const [selectedLessonEnd, setSelectedLessonEnd] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

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
      await ScheduleService.addSchedule({
        title,
        DayOfWeek,
        selectedLessonStart,
        selectedLessonEnd,
        location,
        note,
      });
      navigation.navigate("BottomBar");
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

        <View className="bg-[#F1F5F9] px-5 pt-[4%] space-y-2 h-full">
          <View className="space-y-2">
            <Text className="text-base">Tiêu đề</Text>
            <TextInput
              placeholder="Môn học"
              placeholderTextColor="#000000"
              className="w-[100%] h-12 bg-[#FFFFFF] pl-4 border-2 border-[#3A4666] rounded-lg resize-none"
              value={title}
              onChangeText={(text) => setTitle(text)}
            ></TextInput>
          </View>
          <View className="space-y-2 top-40">
            <Text className="text-base">Địa điểm</Text>
            <TextInput
              placeholder="Địa điểm"
              placeholderTextColor="#000000"
              className="w-[100%] h-12 bg-[#FFFFFF] pl-4 border-2 border-solid border-[#3A4666] rounded-[8px] resize-none"
              value={location}
              onChangeText={(text) => setLocation(text)}
            ></TextInput>
          </View>
          <View className="space-y-2 top-40">
            <Text className="text-base">Ghi chú</Text>
            <TextInput
              placeholder="Nội dung"
              placeholderTextColor="#000000"
              className="w-[100%] h-[50%] bg-[#FFFFFF] px-4 pt-4 border-2 border-solid border-[#3A4666] text-base rounded-[8px] resize-none"
              multiline={true}
              value={note}
              numberOfLines={4}
              onChangeText={(text) => setNote(text)}
              textAlignVertical="top"
            ></TextInput>
          </View>

          <View className="space-y-2 absolute top-24 ml-[5%] w-full z-50">
            <Text className="text-base">Ngày trong tuần</Text>
            <View>
              <SelectList
                data={weekdays}
                value={DayOfWeek}
                setSelected={setDayOfWeek}
                placeholder="Thứ"
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
                }}
              />
            </View>
          </View>
          <View className="space-y-2 absolute top-44 ml-[5%] w-full z-0">
            <Text className="text-base">Tiết</Text>
            <View className="flex-row justify-between">
              <View className="w-[45%]">
                <SelectList
                  data={lessons}
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
                  }}
                />
              </View>
              <View className="w-[45%]">
                <SelectList
                  data={lessons}
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
                    backgroundColor: "#FFFFFF",
                  }}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleAddingUserSchedule}
            className="bg-[#3A4666] rounded-2xl flex items-center justify-center h-[5%] w-[90%] ml-[5%]"
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

export default Schedule_Add;
