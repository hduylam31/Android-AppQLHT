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
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
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
    if (title === "") {
      Alert.alert("Lỗi cập nhật thông tin", "Vui lòng nhập môn học");
    } else if (DayOfWeek === "") {
      Alert.alert("Lỗi cập nhật thông tin", "Vui lòng nhập ngày học môn học");
    } else if (selectedLessonStart === "") {
      Alert.alert(
        "Lỗi cập nhật thông tin",
        "Vui lòng nhập tiết bắt đầu môn học"
      );
    } else if (selectedLessonEnd === "") {
      Alert.alert(
        "Lỗi cập nhật thông tin",
        "Vui lòng nhập tiết kết thúc môn học"
      );
    } else if (Number(selectedLessonStart) >= Number(selectedLessonEnd)) {
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
            screen: "TKB",
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
        screen: "TKB",
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

  //Kiểm tra bàn phím có đang xuất hiện khôngg
  const [isKeyboardShowing, setIsKeyboardShowing] = useState(false);

  const showKeyboard = () => {
    setIsKeyboardShowing(true);
  };

  const hideKeyboard = () => {
    setIsKeyboardShowing(false);
  };

  Keyboard.addListener("keyboardDidShow", showKeyboard);
  Keyboard.addListener("keyboardDidHide", hideKeyboard);

  //Xác định chiều cao TextInput Title
  const [height, setHeight] = useState(0);

  const onContentSizeChange = (event) => {
    const { height } = event.nativeEvent.contentSize;
    setHeight(height);
  };
  const newHeightTitle = height + 50;
  const newHeightTitle2 = height + 140;
  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      {/* Thanh bar tiêu đề và điều hướng */}
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-15">
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={28} color="white" />
            </TouchableOpacity>
            <View>
              <Text className="text-white text-xl font-medium">
                Cập nhật TKB
              </Text>
            </View>

            <TouchableOpacity onPress={AlertDelete}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={28}
                color="white"
              />
            </TouchableOpacity>

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
              className="w-[100%] bg-[#FFFFFF] px-4 py-3 rounded-lg text-base resize-none"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
                height: height,
              }}
              value={title}
              onChangeText={(text) => setTitle(text)}
              multiline={true}
              onContentSizeChange={onContentSizeChange}
            ></TextInput>

            <View className="space-y-2 top-44">
              <Text className="text-base">Địa điểm</Text>
              <TextInput
                placeholder="Địa điểm"
                className="w-[100%] bg-[#FFFFFF] px-4 py-3 rounded-lg text-base resize-none"
                style={{
                  shadowColor: "#000000",
                  shadowOffset: { width: 10, height: 10 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 10,
                }}
                value={location}
                onChangeText={(text) => setLocation(text)}
                multiline={true}
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

            <View
              className="space-y-2 absolute ml-[5%] w-full z-50"
              style={{
                top: newHeightTitle,
              }}
            >
              <View className="flex-row">
                <Text className="text-base">Ngày trong tuần</Text>
                <Text className="text-base text-red-600"> (*)</Text>
              </View>
              <View>
                <SelectList
                  data={weekdays}
                  value={DayOfWeek}
                  setSelected={setDayOfWeek}
                  placeholder={DayOfWeek}
                  notFoundText="Không tìm thấy kết quả"
                  searchPlaceholder="Tìm kiếm"
                  maxHeight={200}
                  inputStyles={{ fontSize: 16, lineHeight: 24 }}
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
            <View
              className="space-y-2 absolute ml-[5%] w-full z-0"
              style={{
                top: newHeightTitle2,
              }}
            >
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
                    placeholder={selectedLessonStart}
                    notFoundText="Không tìm thấy kết quả"
                    searchPlaceholder="Tìm kiếm"
                    maxHeight={200}
                    inputStyles={{ fontSize: 16, lineHeight: 24 }}
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
                    placeholder={selectedLessonEnd}
                    notFoundText="Không tìm thấy kết quả"
                    searchPlaceholder="Tìm kiếm"
                    maxHeight={200}
                    inputStyles={{ fontSize: 16, lineHeight: 24 }}
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
          <View className="h-52"></View>
          {isKeyboardShowing && (
            <TouchableOpacity
              onPress={handleUpdateSchedule}
              className="w-[90%] h-10 mb-6 ml-[5%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <Text className="text-white text-center font-bold text-base">
                Lưu
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {!isKeyboardShowing && (
          <View className="w-full h-16 bg-[#F1F5F9]">
            <TouchableOpacity
              onPress={handleUpdateSchedule}
              className="w-[90%] h-10 absolute bottom-6 ml-[5%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <Text className="text-white text-center font-bold text-base">
                Lưu
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Schedule_Edit;
