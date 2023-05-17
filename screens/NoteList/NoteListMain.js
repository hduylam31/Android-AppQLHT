import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import NoteService from "../../service/NoteService";
import { CheckBox } from "@rneui/themed";

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

  // Hiển thị phần mở rộng
  const [showExtends, setShowExtends] = useState(false);
  const [showExtendsSort, setShowExtendsSort] = useState(false);
  const [selectedCategorySort, setSelectedCategorySort] = useState();

  const [showMultiCheck, setShowMultiCheck] = useState(false);
  const [isCheckSelectAll, setIsCheckSelectAll] = useState(false);
  const [showSaveWorkGroup, setShowSaveWorkGroup] = useState(false);
  const [nameSaveWorkGroup, setNameSaveWorkGroup] = useState();
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleCheckBox = (id) => {
    console.log("id", id);
    if (id === "reset") {
      setShowMultiCheck(false);
      setIsCheckSelectAll(false);
      setSelectedIds([]);
    } else if (id === "all") {
      setSelectedIds(isCheckSelectAll ? [] : data.map((item) => item.id));
      setIsCheckSelectAll(!isCheckSelectAll);
    } else {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };
  console.log("aid", selectedIds);

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView className="flex-1 bg-white">
        <View className="bg-[#3A4666] h-[10%]">
          <View className="flex-row p-4 justify-between items-center">
            {showMultiCheck ? (
              <View>
                <TouchableOpacity
                  className="items-center justify-center w-8 h-8"
                  onPress={() => {
                    setIsCheckSelectAll(!isCheckSelectAll);
                    toggleCheckBox("all");
                  }}
                >
                  {isCheckSelectAll ? (
                    <Ionicons name="checkmark-circle" size={32} color="white" />
                  ) : (
                    <Ionicons name="ellipse-outline" size={32} color="white" />
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View className="w-8 h-8"></View>
            )}
            {showMultiCheck ? (
              selectedIds.length > 0 ? (
                <Text className="text-white text-2xl font-bold text-center">
                  Đã chọn {selectedIds.length}
                </Text>
              ) : (
                <Text className="text-white text-2xl font-bold text-center">
                  Chọn ghi chú
                </Text>
              )
            ) : (
              <Text className="text-white text-2xl font-bold text-center">
                Danh sách ghi chú
              </Text>
            )}

            {showMultiCheck ? (
              <TouchableOpacity
                onPress={() => {
                  toggleCheckBox("reset");
                }}
              >
                <MaterialCommunityIcons name="check" size={32} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setShowExtends(true)}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={32}
                  color="white"
                />
              </TouchableOpacity>
            )}
            {/* Mở rộng 3 chấm */}
            <Modal
              visible={showExtends}
              transparent={true}
              animationType="slide-up"
              onRequestClose={() => setShowExtends(false)}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                  paddingRight: 15,
                  paddingTop: 60,
                }}
                onPress={() => setShowExtends(false)}
              >
                <View className="w-52 h-36 bg-white rounded-lg">
                  <TouchableOpacity
                    onPress={() => {
                      setShowMultiCheck(true);
                      setShowExtends(false);
                    }}
                    className="flex-1 flex-row justify-start items-center"
                  >
                    <Text className="ml-7">Chọn ghi chú</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowExtendsSort(true)}
                    className="flex-1 flex-row justify-start items-center"
                  >
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={28}
                      color="black"
                    />
                    <Text>Sắp xếp theo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("GroupTodoList", {
                        paramMoveData: "NoteMoveData",
                      });
                    }}
                    className="flex-1 flex-row justify-start items-center"
                  >
                    <Text className="ml-7">Nhóm công việc</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>

            {/* Mở rộng phần sắp xếp */}
            {/* <Modal
              visible={showExtendsSort}
              transparent={true}
              animationType="slide-up"
              onRequestClose={() => {
                setShowExtendsSort(false);
                setShowExtends(false);
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                  paddingRight: 15,
                  paddingTop: 110,
                }}
                onPress={() => {
                  setShowExtendsSort(false);
                  setShowExtends(false);
                }}
              >
                <View className="w-52 h-48 bg-white rounded-lg">
                  <TouchableOpacity
                    onPress={() => setShowExtendsSort(false)}
                    className="flex-1 flex-row justify-start items-center"
                  >
                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={28}
                      color="black"
                    />
                    <Text>Sắp xếp theo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSortTime}
                    className="flex-1 flex-row justify-start items-center"
                  >
                    {selectedCategorySort === "SortTime" ? (
                      <MaterialCommunityIcons
                        name="circle-medium"
                        size={28}
                        color="black"
                      />
                    ) : (
                      <View className="w-7 h-7"></View>
                    )}
                    <Text>Thứ tự giờ thông báo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSortAZ}
                    className="flex-1 flex-row justify-start items-center"
                  >
                    {selectedCategorySort === "SortAZ" ? (
                      <MaterialCommunityIcons
                        name="circle-medium"
                        size={28}
                        color="black"
                      />
                    ) : (
                      <View className="w-7 h-7"></View>
                    )}
                    <Text>Thứ tự tiêu để từ A-Z</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSortZA}
                    className="flex-1 flex-row justify-start items-center"
                  >
                    {selectedCategorySort === "SortZA" ? (
                      <MaterialCommunityIcons
                        name="circle-medium"
                        size={28}
                        color="black"
                      />
                    ) : (
                      <View className="w-7 h-7"></View>
                    )}
                    <Text>Thứ tự tiêu để từ Z-A</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal> */}
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
                        <View
                          className={`flex-row ${
                            showMultiCheck
                              ? "justify-between pr-5"
                              : "justify-center"
                          } items-center rounded-t-xl bg-[#9CA2B2] h-8`}
                        >
                          {showMultiCheck && (
                            <CheckBox
                              checked={selectedIds.includes(item.id)}
                              onPress={() => toggleCheckBox(item.id)}
                              iconType="ionicon"
                              checkedIcon="checkmark-circle"
                              uncheckedIcon="ellipse-outline"
                              checkedColor="#4A3780"
                              uncheckedColor="white"
                              size={20}
                              containerStyle={{
                                padding: 0,
                                backgroundColor: "#9CA2B2",
                              }}
                            />
                          )}
                          <Text numberOfLines={1} ellipsizeMode="tail">
                            {item.title}
                          </Text>
                          {showMultiCheck && <View className="w-5 h-5"></View>}
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
          className="w-[90%] h-10 absolute bottom-5 ml-[5%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
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
