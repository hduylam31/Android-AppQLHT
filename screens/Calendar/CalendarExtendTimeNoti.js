import { DataTimeNoti, DataCategoriTimeNoti } from "./DataOfDropDown";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Dropdown } from "react-native-element-dropdown";
import CalendarService from "../../service/CalendarService";

const CalendarExtendTimeNoti = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const [timeMoodleNoti, setTimeMoodleNoti] = useState(null);
  const [customTimeMoodleNoti, setCustomTimeMoodleNoti] = useState("1");
  const [numberTimeMoodleNoti, setNumberTimeMoodleNoti] = useState("5");

  const [timeIndvNoti, setTimeIndvNoti] = useState(null);
  const [customTimeIndvNoti, setCustomTimeIndvNoti] = useState("1");
  const [numberTimeIndvNoti, setNumberTimeIndvNoti] = useState("5");

  const [turnOnButtonSave, setTurnOnButtonSave] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await CalendarService.loadNotiConfig();
      console.log(data);
      const moodleNotiConfig = data.moodleNotiConfig;
      setTimeMoodleNoti(moodleNotiConfig.type);
      setCustomTimeMoodleNoti(moodleNotiConfig.customType);
      setNumberTimeMoodleNoti(moodleNotiConfig.customTime);
      console.log("timeMoodleNoti ", timeMoodleNoti);
    };
    loadData();
  }, []);

  function getTimeInfo(timeNoti, customTimeNoti, numberTimeNoti) {
    var rangeTimeInfo = {
      type: "",
      customType: "",
      customTime: "",
    };

    var rangeTime = -1;
    if (timeNoti == "1") rangeTime = 0;
    if (timeNoti == "2") rangeTime = 5 * 60;
    if (timeNoti == "3") rangeTime = 10 * 60;
    if (timeNoti == "4") rangeTime = 60 * 60;
    if (timeNoti == "5") rangeTime = 60 * 60 * 24;
    if (timeNoti == "6") {
      switch (customTimeNoti) {
        case "1":
          rangeTime = parseInt(numberTimeNoti) * 60;
          break;
        case "2":
          rangeTime = parseInt(numberTimeNoti) * 60 * 60;
          break;
        case "3":
          rangeTime = parseInt(numberTimeNoti) * 60 * 60 * 24;
          break;
        default:
          rangeTime = 60 * 60 * 2;
          break;
      }
    }

    rangeTimeInfo = {
      time: rangeTime,
      type: timeNoti,
      customType: customTimeNoti,
      customTime: numberTimeNoti,
    };
    return rangeTimeInfo;
  }

  async function saveNotiConfig() {
    console.log("hello");
    const rangeTimeMoodleInfo = getTimeInfo(
      timeMoodleNoti,
      customTimeMoodleNoti,
      numberTimeMoodleNoti
    );
    await CalendarService.saveNotiConfig(rangeTimeMoodleInfo);
  }

  return (
    <TouchableWithoutFeedback>
      {/* Thanh bar tiêu đề và điều hướng */}
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-15">
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={32}
                color="white"
              />
            </TouchableOpacity>
            <View>
              <Text className="text-white text-xl font-medium">
                Thời gian thông báo
              </Text>
            </View>
            <View className="w-8 h-8"></View>

            {/* Phần tiêu đề */}
          </View>
        </View>
        <ScrollView className=" bg-[#F1F5F9]">
          {/* Thời gian thông báo sự kiện moodle */}
          <View className="px-5 pt-[4%] space-y-2">
            <Text className="text-base">
              Thời gian thông báo sự kiện moodle
            </Text>
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
              data={DataTimeNoti}
              maxHeight={200}
              labelField="key"
              valueField="value"
              placeholder="Thời gian thông báo sự kiện moodle"
              value={timeMoodleNoti}
              onChange={(item) => {
                setTimeMoodleNoti(item.value);
                setTurnOnButtonSave(true);
              }}
            />
            {timeMoodleNoti === "6" ? (
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
                  value={numberTimeMoodleNoti}
                  onChangeText={(text) => setNumberTimeMoodleNoti(text)}
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
                  value={customTimeMoodleNoti}
                  onChange={(item) => {
                    setCustomTimeMoodleNoti(item.value);
                    setTurnOnButtonSave(true);
                  }}
                />
              </View>
            ) : (
              <View></View>
            )}

            {/* Thời gian thông báo sự kiện moodle */}
            <View className="h-3"></View>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            saveNotiConfig();
            setTurnOnButtonSave(false);
          }}
          disabled={turnOnButtonSave ? false : true}
          className={`w-[90%] h-10 absolute bottom-14 ml-[5%] rounded-2xl flex items-center justify-center ${
            turnOnButtonSave ? "bg-[#3A4666]" : "bg-[#6b6b6f]"
          }`}
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <Text className="text-white text-center font-bold text-base">
            Lưu
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CalendarExtendTimeNoti;
