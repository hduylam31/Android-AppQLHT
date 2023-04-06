import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

import React, { useLayoutEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const NoteList_Add = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [title, setTitle] = useState("");

  const [note, setNote] = useState("");
  console.log(note);

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
  const richText = useRef();

  const getFirstParagraph = () => {
    const contentHtml = richEditorRef.current?.getContentHtml(); // lấy nội dung HTML từ RichEditor
    const firstParagraph = stripHtml(contentHtml).result.split("\n")[0]; // xóa các thẻ HTML và lấy đoạn đầu tiên
    return firstParagraph;
  };

  // const [selectedColor, setSelectedColor] = useState("#000");

  // const handleColorChange = (color) => {
  //   setSelectedColor(color);
  // };

  // const colors = [
  //   "#000", // black
  //   "#f00", // red
  //   "#0f0", // green
  //   "#00f", // blue
  //   "#ff0", // yellow
  //   "#fff", // white
  // ];

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
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={30}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="p-2 border-b-2 border-b-[#9A999B] bg-white">
          <TextInput
            placeholder="Tiêu đề"
            style={{ fontSize: 16 }}
            className="w-[100%] pl-2 resize-none"
            multiline={true}
            value={title}
            onChangeText={(text) => setTitle(text)}
            textAlignVertical="top"
          ></TextInput>
        </View>
        <ScrollView className="px-2 space-y-2 h-full bg-white">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <RichEditor
              ref={richText}
              placeholder="Nội dung"
              // editorStyle={{ color: "red" }}
              onChange={(text) => setNote(text)}
            />
            {/* </View> */}
            {/* <TouchableOpacity
            // onPress={handleAddingUserNoteList}
            className="bg-[#3A4666] rounded-2xl flex items-center justify-center h-[5%] w-[90%] ml-[5%]"
          >
            <Text className="text-white text-center font-bold text-xl">
              Lưu
            </Text>
          </TouchableOpacity> */}
          </KeyboardAvoidingView>
        </ScrollView>
        <View className="flex absolute bottom-0">
          <RichToolbar
            // selectedColor={selectedColor}
            // colors={colors}
            editor={richText}
            actions={[
              actions.keyboard,
              actions.undo,
              actions.redo,
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.alignLeft,
              actions.alignCenter,
              actions.alignRight,
              actions.alignFull,
              actions.insertLink,
              actions.heading1,
              actions.setStrikethrough,
              actions.removeFormat,
              actions.insertVideo,
              actions.checkboxList,
            ]}
            iconMap={{
              [actions.heading1]: () => (
                <Text className="mb-1 text-lg">H1</Text>
              ),
            }}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default NoteList_Add;
