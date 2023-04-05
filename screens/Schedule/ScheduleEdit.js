import { lessons, weekdays } from "./DataOfDropDown";
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";
import ScheduleService from "../../service/ScheduleService";

const Schedule_Edit = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState();
  const [selectedLessonStart, setSelectedLessonStart] = useState("5");
  const [selectedLessonEnd, setSelectedLessonEnd] = useState("5");
  const [location, setLocation] = useState("");
  const [DayOfWeek, setDayOfWeek] = useState("");
  const [note, setNote] = useState("");

  const route = useRoute();
  const {
    c_id,
    c_title,
    c_DayOfWeek,
    c_lessonStart,
    c_lessonEnd,
    c_location,
    c_note,
    dayLessonMap,
  } = route.params;

  useEffect(() => {
    const loadData = () => {
      setTitle(c_title);
      setDayOfWeek(c_DayOfWeek);
      setSelectedLessonStart(c_lessonStart);
      setSelectedLessonEnd(c_lessonEnd);
      setLocation(c_location);
      setNote(c_note);
    };
    loadData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handlePress = () => {
    Keyboard.dismiss();
  };

  const handleUpdateSchedule = async () => {
    console.log("Lesson Validate");
    if (Number(selectedLessonStart) >= Number(selectedLessonEnd)) {
      alert("Tiết bắt đầu phải bé hơn tiết kết thúc");
    } else {
      const removedCurrentLessonMap =
        await ScheduleService.removeCurrentLessonPair(
          dayLessonMap,
          DayOfWeek,
          Number(c_lessonStart),
          Number(c_lessonEnd)
        );
      const isLessonNotConflict = await ScheduleService.dayLessonValidate(
        removedCurrentLessonMap,
        DayOfWeek,
        Number(selectedLessonStart),
        Number(selectedLessonEnd)
      );
      if (!isLessonNotConflict) {
        alert("Vi phạm tiết đã có");
      } else {
        console.log("Start update");
        try {
          await ScheduleService.updateSchedule({
            c_id,
            title,
            selectedLessonStart,
            selectedLessonEnd,
            DayOfWeek,
            location,
            note,
          });
          navigation.navigate("BottomBar", {
            screen: "Schedule",
            params: {
              screenSchedule: "EditToMain",
            },
          });
        } catch (error) {
          console.log("Fail due too: ", error);
        }
      }
    }
  };

  const handleDeleteSchedule = async () => {
    console.log("Start delete");
    try {
      await ScheduleService.deleteSchedule(c_id);
      navigation.navigate("BottomBar", {
        screen: "Schedule",
        params: {
          screenSchedule: "DeleteToMain",
        },
      });
    } catch (error) {
      console.log("Fail due to: ", error);
    }
  };

  const AlertDelete = () => {
    Alert.alert(
      "Xóa thời khóa biểu",
      "Xóa thời khóa biểu khỏi danh sách này ?",
      [
        {
          text: "Đồng ý",
          onPress: handleDeleteSchedule,
        },
        {
          text: "Hủy",
          onPress: () => {
            console.log("No Pressed");
          },
        },
      ]
    );
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
              <Text className="text-white text-xl">Cập nhật TKB</Text>
            </View>
            <View className="w-8 h-8">
              <TouchableOpacity onPress={AlertDelete}>
                <AntDesign name="delete" size={25} color="white" />
              </TouchableOpacity>
            </View>
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
                placeholder={DayOfWeek}
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
                  placeholder={selectedLessonStart}
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
                  placeholder={selectedLessonEnd}
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
            onPress={handleUpdateSchedule}
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

export default Schedule_Edit;
