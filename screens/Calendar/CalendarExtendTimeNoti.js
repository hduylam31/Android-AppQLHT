import { DataTimeNoti, DataCategoriTimeNoti } from "./DataOfDropDown";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Dropdown } from "react-native-element-dropdown";

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
              <Text className="text-white text-xl">Thời gian thông báo</Text>
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
                  }}
                />
              </View>
            ) : (
              <View></View>
            )}

            {/* Thời gian thông báo sự kiện moodle */}
            <Text className="text-base">
              Thời gian thông báo sự kiện cá nhân
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
              placeholder="Thời gian thông báo sự kiện cá nhân"
              value={timeIndvNoti}
              onChange={(item) => {
                setTimeIndvNoti(item.value);
              }}
            />
            {timeIndvNoti === "6" ? (
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
                  value={numberTimeIndvNoti}
                  onChangeText={(text) => setNumberTimeIndvNoti(text)}
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
                  value={customTimeIndvNoti}
                  onChange={(item) => {
                    setCustomTimeIndvNoti(item.value);
                  }}
                />
              </View>
            ) : (
              <View></View>
            )}
            <View className="h-3"></View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CalendarExtendTimeNoti;
