import { lessons, weekdays, lessonsLT, lessonsNVC } from "./DataOfDropDown";
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
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import ScheduleService from "../../service/ScheduleService";
import moment from "moment";

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
    c_lessonInfo,
  } = route.params;

  useEffect(() => {
    const loadData = () => {
      console.log("Load data");
      setTitle(c_title);
      setDayOfWeek(c_DayOfWeek);
      setSelectedLessonStart(c_lessonStart);
      setSelectedLessonEnd(c_lessonEnd);
      setLocation(c_location);
      setNote(c_note);

      switch (c_lessonInfo.type) {
        case 1:
          setIsCheckSelectOfficeLT(true);
          setIsCheckSelectOfficeNVC(false);
          setIsCheckSelectCustom(false);
          setTimeStart(c_lessonInfo.timeStart);
          setTimeEnd(c_lessonInfo.timeEnd);
          break;
        case 2:
          setIsCheckSelectOfficeLT(false);
          setIsCheckSelectOfficeNVC(true);
          setIsCheckSelectCustom(false);
          setTimeStart(c_lessonInfo.timeStart);
          setTimeEnd(c_lessonInfo.timeEnd);
          break;
        case 3:
          setIsCheckSelectOfficeLT(false);
          setIsCheckSelectOfficeNVC(false);
          setIsCheckSelectCustom(true);
          setTextTimeStart(c_lessonInfo.timeStart);
          setTextTimeEnd(c_lessonInfo.timeEnd);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    console.log("haha1");
    handleSelection(selectedLessonStart, selectedLessonEnd);
  }, [selectedLessonStart, selectedLessonEnd]);

  useEffect(() => {
    console.log("hahaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    handleSelection(selectedLessonStart, selectedLessonEnd);
  }, [isCheckSelectOfficeLT, isCheckSelectOfficeNVC]);

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
    const convertedTimeStart = moment(textTimeStart, "HH:mm");
    const convertedTimeEnd = moment(textTimeEnd, "HH:mm");
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
    } else if (
      isCheckSelectCustom &&
      convertedTimeEnd.isBefore(convertedTimeStart)
    ) {
      Alert.alert(
        "Thêm không thành công",
        "Thời gian kết thúc phải lớn hơn thời gian bắt đầu"
      );
    } else if (
      isCheckSelectCustom &&
      (textTimeStart === "Từ" || textTimeEnd === "Đến")
    ) {
      Alert.alert(
        "Tìm kiếm không thành công",
        "Thời gian thêm không được để trống"
      );
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
          var lessonInfo;
          if (isCheckSelectCustom) {
            lessonInfo = {
              timeStart: textTimeStart,
              timeEnd: textTimeEnd,
              type: 3,
            };
          } else if (isCheckSelectOfficeLT) {
            lessonInfo = { timeStart: timeStart, timeEnd: timeEnd, type: 1 };
          } else if (isCheckSelectOfficeNVC) {
            lessonInfo = { timeStart: timeStart, timeEnd: timeEnd, type: 2 };
          }
          console.log("lessonInfo: ", lessonInfo);
          await ScheduleService.updateSchedule({
            c_id,
            title,
            selectedLessonStart,
            selectedLessonEnd,
            DayOfWeek,
            location,
            note,
            lessonInfo,
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

  const [isCheckSelectOfficeLT, setIsCheckSelectOfficeLT] = useState(true);
  const [isCheckSelectOfficeNVC, setIsCheckSelectOfficeNVC] = useState(false);
  const [isCheckSelectCustom, setIsCheckSelectCustom] = useState(false);
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  const handleSelection = (start, end) => {
    console.log("haha2");
    if (isCheckSelectOfficeLT) {
      const filteredData = lessonsLT.filter(
        (item) =>
          Number(item.key) >= Number(start) &&
          Number(item.key) <= Number(end) + 1
      );

      const timeStart = filteredData.length > 0 ? filteredData[0].time : "";
      const timeEnd =
        filteredData.length > 0
          ? filteredData[filteredData.length - 1].time
          : "";
      setTimeStart(timeStart);
      setTimeEnd(timeEnd);
    } else if (isCheckSelectOfficeNVC) {
      const filteredData = lessonsNVC.filter(
        (item) =>
          Number(item.key) >= Number(start) &&
          Number(item.key) <= Number(end) + 1
      );

      const timeStart = filteredData.length > 0 ? filteredData[0].time : "";
      const timeEnd =
        filteredData.length > 0
          ? filteredData[filteredData.length - 1].time
          : "";
      setTimeStart(timeStart);
      setTimeEnd(timeEnd);
    } else if (isCheckSelectCustom) {
      setTimeStart(textTimeStart);
      setTimeEnd(textTimeEnd);
    }
  };

  const handleSelection2 = (
    start,
    end,
    isCheckSelectOfficeLT,
    isCheckSelectOfficeNVC,
    isCheckSelectCustom
  ) => {
    console.log("haha2");
    if (isCheckSelectOfficeLT) {
      const filteredData = lessonsLT.filter(
        (item) =>
          Number(item.key) >= Number(start) &&
          Number(item.key) <= Number(end) + 1
      );

      const timeStart = filteredData.length > 0 ? filteredData[0].time : "";
      const timeEnd =
        filteredData.length > 0
          ? filteredData[filteredData.length - 1].time
          : "";
      setTimeStart(timeStart);
      setTimeEnd(timeEnd);
    } else if (isCheckSelectOfficeNVC) {
      const filteredData = lessonsNVC.filter(
        (item) =>
          Number(item.key) >= Number(start) &&
          Number(item.key) <= Number(end) + 1
      );

      const timeStart = filteredData.length > 0 ? filteredData[0].time : "";
      const timeEnd =
        filteredData.length > 0
          ? filteredData[filteredData.length - 1].time
          : "";
      setTimeStart(timeStart);
      setTimeEnd(timeEnd);
    } else if (isCheckSelectCustom) {
      setTimeStart(textTimeStart);
      setTimeEnd(textTimeEnd);
    }
  };

  const [timeStartCus, setTimeStartCus] = useState(new Date());
  const [showTimeStart, setShowTimeStart] = useState(false);
  const [textTimeStart, setTextTimeStart] = useState("Từ");

  const [timeEndCus, setTimeEndCus] = useState(new Date());
  const [showTimeEnd, setShowTimeEnd] = useState(false);
  const [textTimeEnd, setTextTimeEnd] = useState("Đến");

  const onChangeTimeStart = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowTimeStart(Platform.OS === "ios");
    setTimeStartCus(currentDate);

    let tempDate = new Date(currentDate);

    if (tempDate.getHours() < 10 && tempDate.getMinutes() < 10) {
      fTime = "0" + tempDate.getHours() + ":0" + tempDate.getMinutes();
    } else if (tempDate.getHours() < 10) {
      fTime = "0" + tempDate.getHours() + ":" + tempDate.getMinutes();
    } else if (tempDate.getMinutes() < 10) {
      fTime = tempDate.getHours() + ":0" + tempDate.getMinutes();
    } else {
      fTime = tempDate.getHours() + ":" + tempDate.getMinutes();
    }

    setTextTimeStart(fTime);
  };

  const onChangeTimeEnd = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowTimeEnd(Platform.OS === "ios");
    setTimeEndCus(currentDate);

    let tempDate = new Date(currentDate);

    if (tempDate.getHours() < 10 && tempDate.getMinutes() < 10) {
      fTime = "0" + tempDate.getHours() + ":0" + tempDate.getMinutes();
    } else if (tempDate.getHours() < 10) {
      fTime = "0" + tempDate.getHours() + ":" + tempDate.getMinutes();
    } else if (tempDate.getMinutes() < 10) {
      fTime = tempDate.getHours() + ":0" + tempDate.getMinutes();
    } else {
      fTime = tempDate.getHours() + ":" + tempDate.getMinutes();
    }

    setTextTimeEnd(fTime);
  };
  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      {/* Thanh bar tiêu đề và điều hướng */}
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-14 flex-row justify-between items-center px-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={28} color="white" />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl font-medium">Cập nhật TKB</Text>
          </View>

          <TouchableOpacity onPress={AlertDelete}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={28}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <ScrollView className="bg-[#F1F5F9]">
          <View className="px-4 pt-2 space-y-2">
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
              }}
              value={title}
              onChangeText={(text) => setTitle(text)}
              multiline={true}
            ></TextInput>
            <View className="flex-row">
              <Text className="text-base">Ngày trong tuần</Text>
              <Text className="text-base text-red-600"> (*)</Text>
            </View>
            <Dropdown
              style={{
                backgroundColor: "#FFFFFF",
                height: 48,
                borderRadius: 8,
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
              containerStyle={{
                borderRadius: 8,
              }}
              itemContainerStyle={{
                borderRadius: 8,
                height: 48,
              }}
              itemTextStyle={{
                height: 48,
              }}
              placeholderStyle={{
                fontSize: 16,
                paddingLeft: 16,
                color: "#C7C7CD",
              }}
              selectedTextStyle={{ fontSize: 16, paddingLeft: 16 }}
              iconStyle={{ marginRight: 16 }}
              search
              searchPlaceholder="Tìm kiếm"
              data={weekdays}
              maxHeight={200}
              labelField="key"
              valueField="value"
              placeholder="Ngày trong tuần"
              value={DayOfWeek}
              onChange={(item) => {
                setDayOfWeek(item.value);
              }}
            />
            <View className="flex-row">
              <Text className="text-base">Tiết</Text>
              <Text className="text-base text-red-600"> (*)</Text>
            </View>
            <View className="flex-row justify-between items-center space-x-2">
              <Dropdown
                style={{
                  backgroundColor: "#FFFFFF",
                  height: 48,
                  borderRadius: 8,
                  shadowColor: "#000000",
                  shadowOffset: { width: 10, height: 10 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 10,
                  flex: 1,
                }}
                containerStyle={{
                  borderRadius: 8,
                }}
                itemContainerStyle={{
                  borderRadius: 8,
                  height: 48,
                }}
                itemTextStyle={{
                  height: 48,
                }}
                placeholderStyle={{
                  fontSize: 16,
                  paddingLeft: 16,
                  color: "#C7C7CD",
                }}
                selectedTextStyle={{ fontSize: 16, paddingLeft: 16 }}
                iconStyle={{ marginRight: 16 }}
                search
                searchPlaceholder="Tìm kiếm"
                data={lessons}
                maxHeight={200}
                labelField="key"
                valueField="value"
                placeholder="Từ"
                value={selectedLessonStart}
                onChange={(item) => {
                  setSelectedLessonStart(item.value);
                }}
              />
              <Dropdown
                style={{
                  backgroundColor: "#FFFFFF",
                  height: 48,
                  borderRadius: 8,
                  shadowColor: "#000000",
                  shadowOffset: { width: 10, height: 10 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 10,
                  flex: 1,
                }}
                containerStyle={{
                  borderRadius: 8,
                }}
                itemContainerStyle={{
                  borderRadius: 8,
                  height: 48,
                }}
                itemTextStyle={{
                  height: 48,
                }}
                placeholderStyle={{
                  fontSize: 16,
                  paddingLeft: 16,
                  color: "#C7C7CD",
                }}
                selectedTextStyle={{ fontSize: 16, paddingLeft: 16 }}
                iconStyle={{ marginRight: 16 }}
                search
                searchPlaceholder="Tìm kiếm"
                data={lessons}
                maxHeight={200}
                labelField="key"
                valueField="value"
                placeholder="Đến"
                value={selectedLessonEnd}
                onChange={(item) => {
                  setSelectedLessonEnd(item.value);
                }}
              />
            </View>
            <View className="flex-row">
              <Text className="text-base">Thời gian</Text>
              <Text className="text-base text-red-600"> (*)</Text>
            </View>
            <View
              className="bg-white py-3 px-4 rounded-xl space-y-2"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <View className="flex-row items-center justify-start space-x-2">
                <TouchableOpacity
                  onPress={() => {
                    setIsCheckSelectOfficeLT(true);
                    setIsCheckSelectOfficeNVC(false);
                    setIsCheckSelectCustom(false);
                    handleSelection2(
                      selectedLessonStart,
                      selectedLessonEnd,
                      true,
                      false,
                      false
                    );
                  }}
                >
                  {isCheckSelectOfficeLT ? (
                    <MaterialCommunityIcons
                      name="circle-slice-8"
                      size={20}
                      color="black"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="circle-outline"
                      size={20}
                      color="black"
                    />
                  )}
                </TouchableOpacity>
                <Text className="text-base">Giờ cơ sở Linh Trung</Text>
              </View>
              <View className="flex-row items-center justify-start space-x-2">
                <TouchableOpacity
                  onPress={() => {
                    setIsCheckSelectOfficeLT(false);
                    setIsCheckSelectOfficeNVC(true);
                    setIsCheckSelectCustom(false);
                    handleSelection2(
                      selectedLessonStart,
                      selectedLessonEnd,
                      false,
                      true,
                      false
                    );
                  }}
                >
                  {isCheckSelectOfficeNVC ? (
                    <MaterialCommunityIcons
                      name="circle-slice-8"
                      size={20}
                      color="black"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="circle-outline"
                      size={20}
                      color="black"
                    />
                  )}
                </TouchableOpacity>
                <Text className="text-base">Giờ cơ sở NVC</Text>
              </View>

              <View className="flex-row items-center justify-start space-x-2">
                <TouchableOpacity
                  onPress={() => {
                    setIsCheckSelectOfficeLT(false);
                    setIsCheckSelectOfficeNVC(false);
                    setIsCheckSelectCustom(true);
                  }}
                >
                  {isCheckSelectCustom ? (
                    <MaterialCommunityIcons
                      name="circle-slice-8"
                      size={20}
                      color="black"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="circle-outline"
                      size={20}
                      color="black"
                    />
                  )}
                </TouchableOpacity>
                <Text className="text-base">Tùy chỉnh</Text>
              </View>
              {isCheckSelectCustom ? (
                <View className="flex-row justify-between items-center space-x-2">
                  <TouchableOpacity
                    onPress={() => setShowTimeStart(true)}
                    className="bg-white py-[6px] rounded-lg justify-center items-center border-[1px] border-[#E0E0E0] flex-1"
                  >
                    <Text className="text-base">{textTimeStart}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowTimeEnd(true)}
                    className="bg-white py-[6px] rounded-lg justify-center items-center border-[1px] border-[#E0E0E0] flex-1"
                  >
                    <Text className="text-base">{textTimeEnd}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <></>
              )}
              {showTimeStart ? (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={timeStartCus}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeTimeStart}
                />
              ) : showTimeEnd ? (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={timeEndCus}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeTimeEnd}
                />
              ) : (
                <></>
              )}
            </View>

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

            <Text className="text-base">Ghi chú</Text>
            <TextInput
              placeholder="Nội dung"
              className="w-[100%] py-3 bg-[#FFFFFF] px-4 pt-4 text-base rounded-lg resize-none"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
              multiline={true}
              value={note}
              onChangeText={(text) => setNote(text)}
            ></TextInput>
            <View className="h-12"></View>
          </View>
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
