import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import NoteService from "../../service/NoteService";
import { CheckBox } from "@rneui/themed";
import moment from "moment";

const NoteListFolderSecret = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  const route1 = useRoute();
  const { paramMovetoSecretFolder } = route1.params;
  const [moveData, setMoveData] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  useEffect(() => {
    if (paramMovetoSecretFolder === "MoveData") {
      setMoveData(true);
      setShowMultiCheck(true);
    } else {
      setMoveData(false);
      setShowMultiCheck(false);
    }
  }, [route]);

  // thay loadCalendar thanh loadNoteList 2 useEffect phia duoi
  const loadNoteList = async () => {
    try {
      const notelist = await NoteService.loadNoteData();
      const secretData = notelist.filter((item) => item.isSecret);
      setData(secretData);
    } catch (error) {
      console.log(error);
    }
    setSelectedIds([]);
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
      setSelectedIds(isCheckSelectAll ? [] : data.map((item) => item));
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

  useEffect(() => {
    if (selectedIds.length === data.length) {
      setIsCheckSelectAll(true);
    } else {
      setIsCheckSelectAll(false);
    }
  }, [selectedIds]);

  function handleDeleteNotes() {
    const ids = selectedIds.map((item) => item.id);
    NoteService.deleteNotes(ids);
    const newData = data.filter((item) => !ids.includes(item.id));
    setData(newData);
    setShowMultiCheck(false);
    setIsCheckSelectAll(false);
    setSelectedIds([]);
  }

  const AlertDelete = () => {
    if (selectedIds.length > 0) {
      Alert.alert("Xóa ghi chú", "Xóa ghi chú này khỏi thư mục bảo mật ?", [
        {
          text: "Đồng ý",
          onPress: handleDeleteNotes,
        },
        {
          text: "Hủy",
          onPress: () => {
            toggleCheckBox("reset");
          },
        },
      ]);
    } else {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một ghi chú");
    }
  };

  function handleLovedNote() {
    if (selectedIds.some((item) => !item.isLoved)) {
      const newIds = selectedIds.filter((item) => !item.isLoved);
      NoteService.updateLovedStatus(newIds);
      const ids = newIds.map((item) => item.id);
      const newData = data.map((item) => {
        if (ids.includes(item.id)) {
          return { ...item, isLoved: !item.isLoved };
        } else {
          return item;
        }
      });
      setData(newData);
    } else {
      NoteService.updateLovedStatus(selectedIds);
      const ids = selectedIds.map((item) => item.id);
      const newData = data.map((item) => {
        if (ids.includes(item.id)) {
          return { ...item, isLoved: !item.isLoved };
        } else {
          return item;
        }
      });
      setData(newData);
    }

    setShowMultiCheck(false);
    setIsCheckSelectAll(false);
    setSelectedIds([]);
  }

  const AlertStar = () => {
    if (selectedIds.length > 0) {
      var title = "";
      var detail = "";
      if (selectedIds.some((item) => !item.isLoved)) {
        title = "Thêm vào mục yêu thích";
        detail = "Thêm ghi chú này vào danh sách yêu thích?";
      } else {
        title = "Loại bỏ mục yêu thích";
        detail = "Loại bỏ ghi chú này từ danh sách yêu thích?";
      }
      Alert.alert(title, detail, [
        {
          text: "Đồng ý",
          onPress: handleLovedNote,
        },
        {
          text: "Hủy",
          onPress: () => {
            toggleCheckBox("reset");
          },
        },
      ]);
    } else {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một ghi chú");
    }
  };

  function moveToNormalFolder() {
    NoteService.updateSecretFolder(selectedIds);
    const ids = selectedIds.map((item) => item.id);
    const newData = data.filter((item) => !ids.includes(item.id));
    setData(newData);
    setShowMultiCheck(false);
    setIsCheckSelectAll(false);
    setSelectedIds([]);
  }

  const AlertMove = () => {
    if (selectedIds.length > 0) {
      Alert.alert(
        "Di chuyển ghi chú",
        "Di chuyển ghi chú ra khỏi thư mục bảo mật? ",
        [
          {
            text: "Đồng ý",
            onPress: moveToNormalFolder,
          },
          {
            text: "Hủy",
            onPress: () => {
              toggleCheckBox("reset");
            },
          },
        ]
      );
    } else {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một ghi chú");
    }
  };

  const handleSortAZ = () => {
    const sortedNote2 = data.sort((a, b) => {
      const aTitle = a.title.split(" ")[0].charAt(0);
      const bTitle = b.title.split(" ")[0].charAt(0);
      return aTitle.localeCompare(bTitle);
    });
    setData(sortedNote2);
    setSelectedCategorySort("SortAZ");
    setShowExtendsSort(false);
    setShowExtends(false);
  };
  const handleSortZA = () => {
    const sortedNote3 = data.sort((a, b) => {
      const aTitle = a.title.split(" ")[0].charAt(0);
      const bTitle = b.title.split(" ")[0].charAt(0);
      return bTitle.localeCompare(aTitle);
    });
    setData(sortedNote3);
    setSelectedCategorySort("SortZA");
    setShowExtendsSort(false);
    setShowExtends(false);
  };

  const handleSortCreatedDay = () => {
    const sortedNote4 = data.sort((a, b) => {
      const dateA = moment(a.createdDay, "DD/MM/YYYY");
      const dateB = moment(b.createdDay, "DD/MM/YYYY");
      return dateA - dateB;
    });
    setData(sortedNote4);
    setSelectedCategorySort("SortCreatedDay");
    setShowExtendsSort(false);
    setShowExtends(false);
  };

  const handleSortUpdatedDay = () => {
    const sortedNote5 = data.sort((a, b) => {
      const dateA = moment(a.updatedDay, "DD/MM/YYYY");
      const dateB = moment(b.updatedDay, "DD/MM/YYYY");
      return dateA - dateB;
    });
    setData(sortedNote5);
    setSelectedCategorySort("SortUpdatedDay");
    setShowExtendsSort(false);
    setShowExtends(false);
  };

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-[8%]">
          <View
            className={`flex-row justify-between items-center py-3 pl-4 ${
              showMultiCheck ? "pr-4" : "pr-1"
            }`}
          >
            {showMultiCheck ? (
              <TouchableOpacity
                className="items-center justify-center w-7 h-7"
                onPress={() => {
                  setIsCheckSelectAll(!isCheckSelectAll);
                  toggleCheckBox("all");
                }}
              >
                {isCheckSelectAll ? (
                  <Ionicons name="checkmark-circle" size={22} color="white" />
                ) : (
                  <Ionicons name="ellipse-outline" size={22} color="white" />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("BottomBar", {
                    screen: "Ghi chú",
                    params: {
                      screenNoteList: "EditToMain",
                    },
                  });
                }}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={28}
                  color="white"
                />
              </TouchableOpacity>
            )}
            {showMultiCheck ? (
              selectedIds.length > 0 ? (
                <Text className="text-white text-xl font-medium text-center">
                  Đã chọn {selectedIds.length}
                </Text>
              ) : (
                <Text className="text-white text-xl font-medium text-center">
                  Chọn ghi chú
                </Text>
              )
            ) : (
              <Text className="text-white text-[22px] font-semibold text-center">
                Thư mục bảo mật
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
                    onPress={() => {
                      setShowExtendsSort(true);
                    }}
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
                      navigation.navigate("ChangePassFolderSecret");
                    }}
                    className="flex-1 flex-row justify-start items-center"
                  >
                    <Text className="ml-7">Thay đổi mật mã</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>

            {/* Mở rộng phần sắp xếp */}
            <Modal
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
                <View className="w-52 h-60 bg-white rounded-lg">
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
                  <TouchableOpacity
                    onPress={handleSortCreatedDay}
                    className="flex-1 flex-row justify-start items-center"
                  >
                    {selectedCategorySort === "SortCreatedDay" ? (
                      <MaterialCommunityIcons
                        name="circle-medium"
                        size={28}
                        color="black"
                      />
                    ) : (
                      <View className="w-7 h-7"></View>
                    )}
                    <Text>Thứ tự ngày tạo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSortUpdatedDay}
                    className="flex-1 flex-row justify-start items-center"
                  >
                    {selectedCategorySort === "SortUpdatedDay" ? (
                      <MaterialCommunityIcons
                        name="circle-medium"
                        size={28}
                        color="black"
                      />
                    ) : (
                      <View className="w-7 h-7"></View>
                    )}
                    <Text>Thứ tự ngày cập nhật</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        </View>
        <View className="flex-1 bg-[#F1F5F9]">
          <View className="h-[80%]">
            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {data.map(
                (item) => (
                  (replaceHTML = item.note.replace(/<(.|\n)*?>/g, "").trim()),
                  (replaceWhiteSpace = replaceHTML
                    .replace(/&nbsp;/g, "")
                    .trim()),
                  (
                    <View key={item.id} className="mb-5 m-[4%] w-[42%]">
                      <TouchableOpacity
                        disabled={showMultiCheck ? true : false}
                        onPress={() => {
                          navigation.navigate("NoteList_Edit", { item });
                        }}
                        className="bg-white rounded-xl h-36"
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
                              checked={selectedIds.includes(item)}
                              onPress={() => toggleCheckBox(item)}
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
                      <View className="justify-center items-center flex-row space-x-2 mt-1">
                        <Text>
                          {selectedCategorySort === "SortUpdatedDay"
                            ? item.updatedDay
                            : item.createdDay}
                        </Text>
                        {item.isLoved ? (
                          <MaterialCommunityIcons
                            name="star"
                            size={16}
                            color="#FE8668"
                          />
                        ) : (
                          <View></View>
                        )}
                      </View>
                    </View>
                  )
                )
              )}
            </ScrollView>
          </View>
        </View>
        {showMultiCheck ? (
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={AlertMove}
              className="w-[27%] h-10 absolute bottom-5 left-[5%] bg-[#3A4666] rounded-2xl flex-row items-center justify-center space-x-2"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 5, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <MaterialCommunityIcons
                name="folder-move-outline"
                size={20}
                color="white"
              />
              <Text className="text-white text-center font-semibold text-sm">
                Di chuyển
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={AlertStar}
              className="w-[27%] h-10 absolute bottom-5 left-[37%] bg-[#3A4666] rounded-2xl flex-row items-center justify-center space-x-2"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 5, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <MaterialCommunityIcons
                name="star-outline"
                size={20}
                color="white"
              />
              <Text className="text-white text-center font-semibold text-sm">
                Yêu thích
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={AlertDelete}
              className="w-[27%] h-10 absolute bottom-5 left-[69%] bg-[#c12d2d] rounded-2xl flex-row items-center justify-center space-x-2"
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 5, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={20}
                color="white"
              />
              <Text className="text-white text-center font-semibold text-sm">
                Xóa
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("NoteList_Add", { isSecret: true });
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
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default NoteListFolderSecret;
