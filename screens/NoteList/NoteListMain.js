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
import NoteService from "../../service/NoteService";

const NoteListMain = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // data = [
  //   { id: 1, title: "Vật dụng cần", note: "Kem răng" },
  //   {
  //     id: 2,
  //     title: "Vật dụng mua",
  //     note: "Kem đánh răng là một chất tẩy sạch răng dạng hỗn hợp nhão hay gel được sử dụng với bàn chải đánh răng như một phụ kiện để tẩy sạch, duy trì thẩm mỹ và sức khoẻ của răng. Kem đánh răng dùng để thúc đẩy",
  //   },
  //   { id: 3, title: "Vật dụng cần mua", note: "Kem đánh" },
  //   { id: 4, title: "Vật dụng cần mua", note: "Kem đánh" },
  //   { id: 5, title: "Vật dụng cần mua", note: "Kem đánh" },
  //   { id: 6, title: "Vật dụng cần mua", note: "Kem đánh" },
  //   { id: 7, title: "Vật dụng cần mua", note: "Kem đánh" },
  //   { id: 8, title: "Vật dụng cần mua", note: "Kem đánh" },
  //   { id: 9, title: "Vật dụng cần mua", note: "Kem đánh" },
  //   { id: 10, title: "Vật dụng cần mua", note: "Kem đánh" },
  // ];

  // thay loadCalendar thanh loadNoteList 2 useEffect phia duoi
  const loadNoteList = async () => {
    try {
      const notelist = await NoteService.loadNoteData();
      setData(notelist);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadNoteList();
  }, []);

  const route = useRoute();
  useEffect(() => {
    if (
      route?.params?.screenNoteList === "AddToMain" ||
      route?.params?.screenNoteList === "EditToMain" ||
      route?.params?.screenNoteList === "DeleteToMain"
    ) {
      loadNoteList();
    }
  }, [route]);

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView className="flex-1 bg-white">
        <View className="bg-[#3A4666] h-[10%]">
          <View className="flex-row p-4 justify-between items-center">
            <View className="w-8 h-8 "></View>
            <Text className="text-white text-2xl font-bold">Ghi chú</Text>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={32}
                color="white"
              />
            </TouchableOpacity>
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
              {data.map(
                (item) => (
                  (replaceHTML = item.note.replace(/<(.|\n)*?>/g, "").trim()),
                  (replaceWhiteSpace = replaceHTML
                    .replace(/&nbsp;/g, "")
                    .trim()),
                  (
                    <View
                      key={item.id}
                      className="w-[48%] h-40 mb-[4%] bg-white rounded-xl"
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("NoteList_Edit", { item });
                        }}
                      >
                        <View className="h-7 flex justify-center items-center rounded-t-xl bg-[#FE8668]">
                          <Text numberOfLines={1} ellipsizeMode="tail">
                            {item.title}
                          </Text>
                        </View>
                        <View className="h-full px-3">
                          <Text
                            numberOfLines={3}
                            ellipsizeMode="tail"
                            className={"text-sm"}
                          >
                            {replaceWhiteSpace}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )
                )
              )}
            </ScrollView>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("NoteList_Add");
          }}
          className="w-[90%] h-[5%] absolute bottom-5 ml-[5%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 5,
          }}
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
