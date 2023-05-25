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

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import NoteService from "../../service/NoteService";
import * as ImagePicker from "expo-image-picker";
import DateTimeUtils from "../../service/DateTimeUtils";

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

  const handleAddingUserNoteList = async () => {
    console.log("Start addingg");
    if (
      (title !== "" && note !== "") ||
      (note === "" && title !== "") ||
      (title === "" && note !== "")
    ) {
      try {
        await NoteService.addNote(title, note); 
        navigation.navigate("BottomBar", {
          screen: "Ghi chú",
          params: {
            screenNoteList: "AddToMain",
          },
        });
      } catch (error) {
        console.log("Fail due to: ", error);
      }
    } else {
      navigation.navigate("BottomBar", {
        screen: "Ghi chú",
        params: {
          screenNoteList: "AddToMain",
        },
      });
    }
  };
  const richText = useRef();

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

  // const handleUnHeading = () => {
  //   richText.current?.getSelectedHtml().then((selectedHtml) => {
  //     const unHeadingHtml = selectedHtml.replace(/<h[1-6]>/, "");
  //     console.log("test", unHeadingHtml);
  //   });
  // };

  // const pickImage = () => {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 300,
  //     cropping: true,
  //   }).then((image) => {
  //     console.log(image);
  //     convertBase64(image);
  //   });
  // };

  // const convertBase64 = (image) => {
  //   ImgToBase64.getBase64String(image.path)
  //     .then((base64String) => {
  //       const str = `data:${image.mine};base64,${base64String}`;
  //       richText.current.insertImage(str);
  //     })
  //     .catch((err) => doSomethingWith(err));
  // };

  const pickImage = async () => {
    // Kiểm tra quyền truy cập vào thư viện hình ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission denied to access media library");
      return;
    }

    // Chọn hình ảnh từ thư viện
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.3,
    });
    console.log(result);
    if (!result.canceled) {
      // const imageUri = result.assets[0].uri;
      const imageUri64 = `data:image/jpg;base64,${result.assets[0].base64}`;

      // Thêm hình ảnh vào trình soạn thảo
      // const html = `<img src="${imageUri}" alt="Image"/>`;
      richText.current.insertImage(imageUri64);
    }
  };
  return (
    <TouchableWithoutFeedback>
      {/* Thanh bar tiêu đề và điều hướng */}
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-15">
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity onPress={handleAddingUserNoteList}>
              <AntDesign name="arrowleft" size={30} color="white" />
            </TouchableOpacity>
            <View>
              <Text className="text-white text-xl">Thêm ghi chú mới</Text>
            </View>

            {isKeyboardShowing ? (
              <TouchableOpacity
                onPress={() => richText.current?.dismissKeyboard()}
              >
                <MaterialCommunityIcons name="check" size={30} color="white" />
              </TouchableOpacity>
            ) : (
              <View className="w-8 h-8"></View>
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
              initialHeight={650}
              // editorStyle={{ backgroundColor: "red" }}
              onChange={(text) => setNote(text)}
            />
            {/* </View> */}
            {/* <TouchableOpacity
            onPress={handleAddingUserNoteList}
            className="bg-[#3A4666] rounded-2xl flex items-center justify-center h-[5%] w-[90%] ml-[5%]">
            <Text className="text-white text-center font-bold text-xl">
              Lưu
            </Text>
           </TouchableOpacity> */}
          </KeyboardAvoidingView>
        </ScrollView>
        <View className="flex absolute bottom-0">
          <RichToolbar
            selectedIconTint="#2095F2"
            selectedButtonStyle={{ backgroundColor: "transparent" }}
            editor={richText}
            actions={[
              actions.insertImage,
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
            onPressAddImage={() => {
              pickImage();
            }}
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

export default NoteList_Add;
