import { lessons, weekdays } from "./DataOfDropDown";
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";

import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";

import ScheduleService from "../../service/ScheduleService";

const Schedule_Add = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dayLessonMap = route.params;
  const [title, setTitle] = useState("");
  const [DayOfWeek, setDayOfWeek] = useState("");
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
    console.log("Lesson Validate");
    if (title === "") {
      Alert.alert("Lỗi thêm thông tin", "Vui lòng nhập môn học mới");
    } else if (DayOfWeek === "") {
      Alert.alert("Lỗi thêm thông tin", "Vui lòng nhập ngày học môn học");
    } else if (selectedLessonStart === "") {
      Alert.alert("Lỗi thêm thông tin", "Vui lòng nhập tiết bắt đầu môn học");
    } else if (selectedLessonEnd === "") {
      Alert.alert("Lỗi thêm thông tin", "Vui lòng nhập tiết kết thúc môn học");
    } else if (Number(selectedLessonStart) >= Number(selectedLessonEnd)) {
      Alert.alert(
        "Lỗi thêm thông tin",
        "Tiết bắt đầu phải bé hơn tiết kết thúc"
      );
    } else {
      const isLessonNotConflict = await ScheduleService.dayLessonValidate(
        dayLessonMap,
        DayOfWeek,
        Number(selectedLessonStart),
        Number(selectedLessonEnd)
      );
      if (!isLessonNotConflict) {
        Alert.alert("Lỗi thêm thông tin", "Vi phạm tiết đã có");
      } else {
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
          navigation.navigate("BottomBar", {
            screen: "TKB",
            params: {
              screenSchedule: "AddToMain",
            },
          });
        } catch (error) {
          console.log("Fail due to: ", error);
        }
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
              <AntDesign name="arrowleft" size={30} color="white" />
            </TouchableOpacity>
            <View>
              <Text className="text-white text-xl">Thêm sự kiện mới</Text>
            </View>
            <View className="w-8 h-8"></View>
            {/* Phần tử rỗng để căn chỉnh phần tử thứ hai với phần tử đầu tiên
        {/* Phần tiêu đề */}
          </View>
        </View>
        <ScrollView className="bg-[#F1F5F9]">
          <View className="px-5 pt-[4%] space-y-2">
            <View className="flex-row">
              <Text className="text-base">Tiêu đề</Text>
              <Text className="text-base text-red-600"> (*)</Text>
            </View>
            <TextInput
              placeholder="Môn học"
              multiline={true}
              className="w-[100%] h-12 bg-[#FFFFFF] px-4 py-3 rounded-lg text-base resize-none"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
              value={title}
              onChangeText={(text) => setTitle(text)}
            ></TextInput>

            <View className="space-y-2 top-44">
              <Text className="text-base">Địa điểm</Text>
              <TextInput
                placeholder="Địa điểm"
                className="w-[100%] h-12 bg-[#FFFFFF] pl-4 rounded-lg text-base resize-none"
                style={{
                  shadowColor: "#000000",
                  shadowOffset: { width: 10, height: 10 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 10,
                }}
                value={location}
                onChangeText={(text) => setLocation(text)}
              ></TextInput>
            </View>
            <View className="space-y-2 top-44">
              <Text className="text-base">Ghi chú</Text>
              <TextInput
                placeholder="Nội dung"
                className="w-[100%] h-56 bg-[#FFFFFF] px-4 pt-4 text-base rounded-lg resize-none"
                style={{
                  shadowColor: "#000000",
                  shadowOffset: { width: 10, height: 10 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 10,
                }}
                multiline={true}
                value={note}
                numberOfLines={4}
                onChangeText={(text) => setNote(text)}
                textAlignVertical="top"
              ></TextInput>
            </View>

            <View className="space-y-2 absolute top-24 ml-[5%] w-full z-50">
              <View className="flex-row">
                <Text className="text-base">Ngày trong tuần</Text>
                <Text className="text-base text-red-600"> (*)</Text>
              </View>
              <View>
                <SelectList
                  data={weekdays}
                  value={DayOfWeek}
                  setSelected={setDayOfWeek}
                  placeholder="Thứ"
                  notFoundText="Không tìm thấy kết quả"
                  searchPlaceholder="Tìm kiếm"
                  maxHeight={200}
                  inputStyles={[
                    DayOfWeek !== ""
                      ? { color: "#000000" }
                      : { color: "#C7C7CD" },
                    {
                      fontSize: 16,
                      lineHeight: 24,
                    },
                  ]}
                  boxStyles={{
                    height: 48,
                    borderWidth: 0,
                    backgroundColor: "#FFFFFF",
                    shadowColor: "#000000",
                    shadowOffset: { width: 10, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 10,
                  }}
                  dropdownStyles={{
                    backgroundColor: "#FFFFFF",
                  }}
                />
              </View>
            </View>
            <View className="space-y-2 absolute top-[184px] ml-[5%] w-full z-0">
              <View className="flex-row">
                <Text className="text-base">Tiết</Text>
                <Text className="text-base text-red-600"> (*)</Text>
              </View>
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
                    inputStyles={[
                      selectedLessonStart !== ""
                        ? { color: "#000000" }
                        : { color: "#C7C7CD" },
                      {
                        fontSize: 16,
                        lineHeight: 24,
                      },
                    ]}
                    boxStyles={{
                      height: 48,
                      borderWidth: 0,
                      backgroundColor: "#FFFFFF",
                      shadowColor: "#000000",
                      shadowOffset: { width: 10, height: 10 },
                      shadowOpacity: 0.5,
                      shadowRadius: 10,
                      elevation: 10,
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
                    inputStyles={[
                      selectedLessonEnd !== ""
                        ? { color: "#000000" }
                        : { color: "#C7C7CD" },
                      {
                        fontSize: 16,
                        lineHeight: 24,
                      },
                    ]}
                    boxStyles={{
                      height: 48,
                      borderWidth: 0,
                      backgroundColor: "#FFFFFF",
                      shadowColor: "#000000",
                      shadowOffset: { width: 10, height: 10 },
                      shadowOpacity: 0.5,
                      shadowRadius: 10,
                      elevation: 10,
                    }}
                    dropdownStyles={{
                      backgroundColor: "#FFFFFF",
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleAddingUserSchedule}
            className="bg-[#3A4666] rounded-2xl flex items-center justify-center mt-56 mb-6 h-10 w-[90%] ml-[5%]"
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
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Schedule_Add;
