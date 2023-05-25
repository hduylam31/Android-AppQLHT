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

import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import NoteService from "../../service/NoteService";

const NoteList_Edit = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [title, setTitle] = useState("");

  const [note, setNote] = useState("");
  const c_item = route.params.item;

  useEffect(() => {
    const setData = async () => {
      console.log(c_item);
      setTitle(c_item.title);
      setNote(c_item.note);
    };
    setData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handlePress = () => {
    Keyboard.dismiss();
  };

  const handleUpdateNoteList = async () => {
    console.log("Start update");
    if (title == c_item.title && note == c_item.note) {
      console.log("No Update");
      navigation.goBack();
      return;
    }
    try {
      await NoteService.updateNote({ 
        c_id: c_item.id,
        title,
        note,  
        createdDay: c_item.createdDay,  
        isLoved: c_item.isLoved,
        isSecret: c_item.isSecret
      });
      navigation.navigate("BottomBar", {
        screen: "Ghi chú",
        params: {
          screenNoteList: "EditToMain",
        },
      });
    } catch (error) {
      console.log("Fail due to: ", error);
    }
  };

  const handleDeleteNoteList = async () => {
    console.log("Start delete");
    try {
      await NoteService.deleteNote(c_item.id);
      navigation.navigate("BottomBar", {
        screen: "Ghi chú",
        params: {
          screenNoteList: "DeleteToMain",
        },
      });
    } catch (error) {
      console.log("Fail due to: ", error);
    }
  };

  const AlertDelete = () => {
    Alert.alert("Xóa ghi chú", "Xóa ghi chú khỏi danh sách ?", [
      {
        text: "Đồng ý",
        onPress: handleDeleteNoteList,
      },
      {
        text: "Hủy",
        onPress: () => {
          console.log("No Pressed");
        },
      },
    ]);
  };

  const richText = useRef();

  const [isKeyboardShowing, setIsKeyboardShowing] = useState(false);

  const showKeyboard = () => {
    console.log("Keyboard is showing");
    setIsKeyboardShowing(true);
  };

  const hideKeyboard = () => {
    console.log("Keyboard is hiding");
    setIsKeyboardShowing(false);
  };

  Keyboard.addListener("keyboardDidShow", showKeyboard);
  Keyboard.addListener("keyboardDidHide", hideKeyboard);

  return (
    <TouchableWithoutFeedback>
      {/* Thanh bar tiêu đề và điều hướng */}
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-15">
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity onPress={handleUpdateNoteList}>
              <AntDesign name="arrowleft" size={30} color="white" />
            </TouchableOpacity>
            <View>
              <Text className="text-white text-xl">Cập nhật ghi chú</Text>
            </View>
            {isKeyboardShowing ? (
              <TouchableOpacity
                onPress={() => richText.current?.dismissKeyboard()}
              >
                <MaterialCommunityIcons name="check" size={30} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={AlertDelete}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={30}
                  color="white"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="p-2 border-b-2 border-b-[#9A999B] bg-white">
          <TextInput
            placeholder="Tiêu đề"
            style={{ fontSize: 20, fontWeight: "bold" }}
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
              initialContentHTML={note}
              initialHeight={650}
              onChange={(text) => setNote(text)}

              // editorStyle={{ color: "red" }}

              // onChange={(text) => setNote(text)}
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
            selectedIconTint="#2095F2"
            selectedButtonStyle={{ backgroundColor: "transparent" }}
            editor={richText}
            actions={[
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
              actions.heading2,
              actions.removeFormat,
              actions.setStrikethrough,
            ]}
            iconMap={{
              [actions.heading2]: () => (
                <Text className="mb-1 text-lg">H1</Text>
              ),
            }}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default NoteList_Edit;
