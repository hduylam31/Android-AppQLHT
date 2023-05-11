import { DataTimeNoti, DataCategoriTimeNoti } from "./DataOfDropDown";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import CalendarService from "../../service/CalendarService";
import moment from "moment";
import { Dropdown } from "react-native-element-dropdown";

const Calendar_Add = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isNotified, setIsNotified] = useState(true);

  const route = useRoute();
  const selectedDay = route.params.selectedDay;
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
    if (tempDate.getHours() < 10 && tempDate.getMinutes() < 10) {
      fTime = "0" + tempDate.getHours() + ":0" + tempDate.getMinutes();
    } else if (tempDate.getHours() < 10) {
      fTime = "0" + tempDate.getHours() + ":" + tempDate.getMinutes();
    } else if (tempDate.getMinutes() < 10) {
      fTime = tempDate.getHours() + ":0" + tempDate.getMinutes();
    } else {
      fTime = tempDate.getHours() + ":" + tempDate.getMinutes();
    }
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

  const handleAddingUserCalendar = async () => {
    if (title === "") {
      Alert.alert(
        "Lỗi thêm thông tin",
        "Tiêu đề không được để trống vui lòng nhập tiêu đề"
      );
    } else {
      console.log("Start addingg");
      try {
        var rangeTimeInfo = {
          "type": "",
          "customType": "",
          "customTime": ""
        };
        if(isNotified){
          var rangeTime = -1;
          if(timeNoti == "1") rangeTime=0;
          if(timeNoti == "2") rangeTime=5*60;
          if(timeNoti == "3") rangeTime=10*60;
          if(timeNoti == "4") rangeTime=60*60;
          if(timeNoti == "5") rangeTime=60*60*24; 
          if(timeNoti == "6") {
            switch (customTimeNoti) {
              case "1":
                rangeTime = parseInt(numberTimeNoti)*60;
                break;
              case "2":
                rangeTime = parseInt(numberTimeNoti)*60*60;
                break;
              case "3":
                rangeTime = parseInt(numberTimeNoti)*60*60*24;
                break;
              default:
                rangeTime = 60*60*2;
                break;   
            }
          }
          
          rangeTimeInfo = {
            "time": rangeTime,
            "type": timeNoti,
            "customType": customTimeNoti,
            "customTime": numberTimeNoti
          }
        }
        
        await CalendarService.addUserCalendar( 
          title,
          textDate,
          textTime,
          content,
          isNotified,
          rangeTimeInfo
        );
        navigation.navigate("BottomBar", {
          screen: "Lịch",
          params: {
            screenCalendar: "AddToMain",
          },
        });
      } catch (error) {
        console.log("Fail due too: ", error);
      }
    }
  };

  const [timeNoti, setTimeNoti] = useState("4");
  const [customTimeNoti, setCustomTimeNoti] = useState("1");
  const [numberTimeNoti, setNumberTimeNoti] = useState("5");

  console.log("cus", customTimeNoti);
  console.log("number", numberTimeNoti);

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
            <View className="w-8 h-8"></View>
            {/* <TouchableOpacity onPress={handleAddingUserCalendar}>
              <MaterialCommunityIcons name="check" size={30} color="white" />
            </TouchableOpacity> */}

            {/* Phần tử rỗng để căn chỉnh phần tử thứ hai với phần tử đầu tiên
        {/* Phần tiêu đề */}
          </View>
        </View>
        <ScrollView className=" bg-[#F1F5F9]">
          <View className="px-5 pt-[4%] space-y-2">
            <View className="flex-row">
              <Text className="text-base">Tiêu đề</Text>
              <Text className="text-base text-red-600"> (*)</Text>
            </View>
            <TextInput
              placeholder="Tiêu đề"
              multiline={true}
              className="w-[100%] bg-[#FFFFFF] px-4 py-3 rounded-lg resize-none text-base"
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
            <View className="flex-row justify-between items-center">
              <View className="space-y-2 w-[49%]">
                <View className="flex-row">
                  <Text className="text-base">Ngày</Text>
                  <Text className="text-base text-red-600"> (*)</Text>
                </View>
                <TouchableOpacity
                  onPress={() => showMode("date")}
                  className=" bg-[#FFFFFF] h-12 flex-row rounded-lg justify-between items-center px-3"
                  style={{
                    shadowColor: "#000000",
                    shadowOffset: { width: 10, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 10,
                  }}
                >
                  <Text className="text-base ">{textDate}</Text>
                  <AntDesign name="calendar" size={25} color="black" />
                </TouchableOpacity>
              </View>
              <View className="space-y-2 w-[49%]">
                <View className="flex-row">
                  <Text className="text-base">Giờ</Text>
                  <Text className="text-base text-red-600"> (*)</Text>
                </View>
                <TouchableOpacity
                  onPress={() => showMode("time")}
                  className="bg-[#FFFFFF] h-12 flex-row rounded-lg justify-between items-center px-3 "
                  style={{
                    shadowColor: "#000000",
                    shadowOffset: { width: 10, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 10,
                  }}
                >
                  <Text className="text-base">{textTime}</Text>
                  <AntDesign name="clockcircleo" size={25} color="black" />
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
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
              />
            </View>
            <Text className="text-base">Thời gian thông báo</Text>
            <Dropdown
              disable={isNotified ? false : true}
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
              data={DataTimeNoti}
              maxHeight={200}
              labelField="key"
              valueField="value"
              placeholder="Thời gian thông báo"
              value={isNotified ? timeNoti : ""}
              onChange={(item) => {
                setTimeNoti(item.value);
              }}
            />
            {timeNoti === "6" && isNotified ? (
              <View className="flex-row justify-between">
                <TextInput
                  keyboardType="numeric"
                  className="w-[48%] bg-[#FFFFFF] px-4 py-2 rounded-lg resize-none text-base"
                  style={{
                    shadowColor: "#000000",
                    shadowOffset: { width: 10, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 10,
                  }}
                  value={numberTimeNoti}
                  onChangeText={(text) => setNumberTimeNoti(text)}
                ></TextInput>
                <Dropdown
                  style={{
                    backgroundColor: "#FFFFFF",
                    height: 48,
                    width: "48%",
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
                  data={DataCategoriTimeNoti}
                  maxHeight={200}
                  labelField="key"
                  valueField="value"
                  value={customTimeNoti}
                  onChange={(item) => {
                    setCustomTimeNoti(item.value);
                  }}
                />
              </View>
            ) : (
              <View></View>
            )}
            {/* Nội dung phần ghi chú */}
            <Text className="text-base">Ghi chú</Text>
            <TextInput
              placeholder="Nội dung"
              className="w-[100%] h-52 bg-[#FFFFFF] px-4 pt-4 rounded-lg resize-none text-base"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10,
              }}
              multiline={true}
              value={content}
              numberOfLines={8}
              onChangeText={(text) => setContent(text)}
              textAlignVertical="top"
            ></TextInput>
          </View>
          {/* Nút thêm */}
          <View className="h-20"></View>
          {isKeyboardShowing && (
            <TouchableOpacity
              onPress={handleAddingUserCalendar}
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
              onPress={handleAddingUserCalendar}
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

export default Calendar_Add;
