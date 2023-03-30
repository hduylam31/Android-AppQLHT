import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { CatImage } from "../../assets";
import ScheduleService from "../../service/ScheduleService";

const ScheduleMain = () => {
  const [selectedTab, setSelectedTab] = useState(false);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState("T.2");
  const dayOfWeek = ["T.2", "T.3", "T.4", "T.5", "T.6", "T.7", "CN"];
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  let [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const scheduleData = await ScheduleService.loadScheduleData();
      setData(scheduleData);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const onDayPress = (day) => {
    console.log(day);
    setSelectedDayOfWeek(day);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const ListEmptyComponent = () => (
    <View className="h-96 flex justify-center items-center">
      <Image source={CatImage} className="w-100 h-100 mb-5" />
      <Text>Bạn chưa có lịch học</Text>
    </View>
  );

  renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Schedule_Edit", {
          c_id: item.id,
          c_title: item.title,
          c_DayOfWeek: item.DayOfWeek,
          c_lessonStart: item.lessonStart,
          c_lessonEnd: item.lessonEnd,
          c_location: item.location,
          c_note: item.note,
        });
      }}
    >
      <Animatable.View
        animation="flipInX"
        delay={index * 10}
        className="mx-[5%] my-[3%] bg-white rounded-xl flex-1 flex-row content-center"
      >
        <View className="flex justify-center items-center w-[15%] ">
          <Text className="text-base font-medium">Tiết</Text>
          <Text className="text-base font-medium">
            {item.lessonStart} - {item.lessonEnd}
          </Text>
        </View>
        <View className="w-[1%] h-[70%] mt-[4%] mr-[3%] bg-[#FE8668] "></View>
        <View className=" my-3">
          <View className="flex-row">
            <MaterialCommunityIcons
              style={{ marginTop: 2 }}
              name="bookmark"
              size={18}
              color="#23ACCD"
            />
            <Text className="text-base font-medium ml-1">{item.title}</Text>
          </View>
          <View className="flex-row">
            <MaterialCommunityIcons
              style={{ marginTop: 2 }}
              name="map-marker"
              size={16}
              color="#FF0404"
            />
            <Text className="text-sm font-normal ml-1">{item.location}</Text>
          </View>
          <View className="flex-row">
            <MaterialCommunityIcons
              style={{ marginTop: 2 }}
              name="file-document-outline"
              size={16}
              color="#3A4666"
            />
            <Text className="text-sm font-normal ml-1">{item.note}</Text>
          </View>
        </View>
      </Animatable.View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView className="flex-1">
        <View className="h-[25%] bg-[#3A4666]">
          <View className="flex-row mt-[3%]">
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={32}
                color="white"
              />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold ml-[22%]">
              Thời khóa biểu
            </Text>
          </View>
          <View className="justify-center items-center mt-[3%]">
            <View className="w-[45%] h-7 border-1 rounded-xl bg-[#9CA2B2] flex-row items-center">
              <TouchableOpacity
                onPress={() => {
                  setSelectedTab(false);
                }}
                className={`w-[50%] h-[96%] bg-white items-center justify-center rounded-xl ${
                  !selectedTab ? "bg-white" : "bg-[#9CA2B2]"
                }`}
              >
                <Text>Ngày</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedTab(true);
                }}
                className={`w-[50%] h-[96%] bg-white items-center justify-center rounded-xl ${
                  selectedTab ? "bg-white" : "bg-[#9CA2B2]"
                }`}
              >
                <Text>Tuần</Text>
              </TouchableOpacity>
            </View>
          </View>
          {!selectedTab && (
            <View className="bg-white mt-[3%] h-[40%] w-[90%] ml-[5%] rounded-xl">
              <View className="h-full w-[90%] flex-row justify-between items-center ml-[5%]">
                {dayOfWeek.map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => onDayPress(day)}
                    className={`justify-center items-center h-[35%] w-[11%] rounded-lg ${
                      day === selectedDayOfWeek
                        ? "bg-[#FE8668]"
                        : "bg-[#f9c2b4]"
                    }`}
                  >
                    <Text>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
        <View className="bg-[#F1F5F9] w-full h-full">
          {!selectedTab && (
            <View className="bg-[#F1F5F9] w-full h-[65%]">
              <FlatList
                data={data.filter(
                  (ScheduleData) => ScheduleData.DayOfWeek === selectedDayOfWeek
                )}
                keyExtractor={(item) => item.id.toString()}
                renderItem={this.renderItem}
                ListEmptyComponent={ListEmptyComponent}
              />
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Schedule_Add");
          }}
          className="w-[70%] h-[5%] absolute bottom-2 ml-[15%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
        >
          <Text className="text-white text-center font-bold text-base">
            Thêm thời khóa biểu
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ScheduleMain;
