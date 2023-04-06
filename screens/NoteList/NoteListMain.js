import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

const NoteListMain = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  data = [
    { id: 1, title: "Vật dụng cần", note: "Kem răng" },
    {
      id: 2,
      title: "Vật dụng mua",
      note: "Kem đánh răng là một chất tẩy sạch răng dạng hỗn hợp nhão hay gel được sử dụng với bàn chải đánh răng như một phụ kiện để tẩy sạch, duy trì thẩm mỹ và sức khoẻ của răng. Kem đánh răng dùng để thúc đẩy",
    },
    { id: 3, title: "Vật dụng cần mua", note: "Kem đánh" },
    { id: 4, title: "Vật dụng cần mua", note: "Kem đánh" },
    { id: 5, title: "Vật dụng cần mua", note: "Kem đánh" },
    { id: 6, title: "Vật dụng cần mua", note: "Kem đánh" },
    { id: 7, title: "Vật dụng cần mua", note: "Kem đánh" },
    { id: 8, title: "Vật dụng cần mua", note: "Kem đánh" },
    { id: 9, title: "Vật dụng cần mua", note: "Kem đánh" },
    { id: 10, title: "Vật dụng cần mua", note: "Kem đánh" },
  ];

  // thay loadCalendar thanh loadNoteList 2 useEffect phia duoi

  // const loadCalendar = async () => {
  //   try {
  //     const calendar = await CalendarService.loadCalendarData();
  //     setCalendar(calendar);
  //     const calendarProcess = await CalendarService.processDataForCalendar(
  //       calendar
  //     );
  //     setMarkedDates(calendarProcess);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   loadCalendar();
  // }, []);

  // const route = useRoute();
  // useEffect(() => {
  //   if (
  //     route?.params?.screenCalendar === "AddToMain" ||
  //     route?.params?.screenCalendar === "EditToMain" ||
  //     route?.params?.screenCalendar === "DeleteToMain"
  //   ) {
  //     loadCalendar();
  //   }
  // }, [route]);

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-[10%]">
          <View className="flex-row p-4 justify-between items-center">
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={32}
                color="white"
              />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">Ghi chú</Text>
            <View className="w-8 h-8 "></View>
          </View>
        </View>
        <View className="h-full bg-[#F1F5F9]">
          <View className="h-[80%]">
            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                padding: "4%",
              }}
            >
              {data.map((item) => (
                <View
                  key={item.id}
                  className="w-[48%] h-40 mb-[4%] bg-white rounded-xl"
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("NoteList_Edit");
                    }}
                  >
                    <View className="h-7 flex justify-center items-center rounded-t-xl bg-[#FE8668]">
                      <Text>{item.title}</Text>
                    </View>
                    <View className="h-full">
                      <Text
                        numberOfLines={5}
                        ellipsizeMode="tail"
                        className={"text-sm"}
                      >
                        {item.note}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("NoteList_Add");
          }}
          className="w-[70%] h-[5%] absolute bottom-2 ml-[15%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
        >
          <Text className="text-white text-center font-bold text-base">
            Thêm ghi chú
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default NoteListMain;
