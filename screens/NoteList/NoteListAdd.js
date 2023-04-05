import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from "react-native";

import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

const NoteList_Add = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [title, setTitle] = useState("");

  const [note, setNote] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handlePress = () => {
    Keyboard.dismiss();
  };

  //   const handleAddingUserNoteList = async () => {
  //     console.log("Lesson Validate");
  //         console.log("Start addingg");
  //         try {
  //           await ScheduleService.addSchedule({
  //             title,
  //             DayOfWeek,
  //             selectedLessonStart,
  //             selectedLessonEnd,
  //             location,
  //             note,
  //           });
  //           navigation.navigate("BottomBar", {
  //             screen: "NoteList",
  //             params: {
  //               screenNoteList: "AddToMain",
  //             },
  //           });
  //         } catch (error) {
  //           console.log("Fail due to: ", error);
  //         }
  //       }
  //     }
  //   };

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
              <Text className="text-white text-xl">Thêm ghi chú mới</Text>
            </View>
            <View className="w-8 h-8"></View>
            {/* Phần tử rỗng để căn chỉnh phần tử thứ hai với phần tử đầu tiên
        {/* Phần tiêu đề */}
          </View>
        </View>

        <View className="bg-[#F1F5F9] px-5 pt-[4%] space-y-2 h-full">
          <View className="space-y-2">
            <Text className="text-base">Tiêu đề</Text>

            <TextInput
              placeholder="Tiêu đề"
              placeholderTextColor="#000000"
              className="w-[100%] h-12 bg-[#FFFFFF] pl-4 border-2 border-[#3A4666] rounded-lg resize-none"
              value={title}
              onChangeText={(text) => setTitle(text)}
            ></TextInput>
          </View>
          <View className="space-y-2">
            <Text className="text-base">Ghi chú</Text>
            <TextInput
              placeholder="Nội dung"
              placeholderTextColor="#000000"
              className="w-[100%] h-[462px] bg-[#FFFFFF] px-4 pt-4 border-2 border-solid border-[#3A4666] text-base rounded-[8px] resize-none"
              multiline={true}
              value={note}
              onChangeText={(text) => setNote(text)}
              textAlignVertical="top"
            ></TextInput>
          </View>
          <TouchableOpacity
            // onPress={handleAddingUserNoteList}
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

export default NoteList_Add;
