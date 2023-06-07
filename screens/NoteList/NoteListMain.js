import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  TextInput,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import NoteService from "../../service/NoteService";
import { CheckBox } from "@rneui/themed";
import moment from "moment";

const NoteListMain = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // thay loadCalendar thanh loadNoteList 2 useEffect phia duoi
  const loadNoteList = async () => {
    setShowMultiCheck(false);
    setSelectedIds([]);
    try {
      const notelist = await NoteService.loadNoteData();
      const notSecretData = notelist.filter((item) => !item.isSecret);
      setData(notSecretData);
      const secretPass = await NoteService.loadSecretPasswordData();
      setSecretPassword(secretPass);
      console.log("Load data done");
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
  const [selectedCategorySort, setSelectedCategorySort] = useState("");

  const [showMultiCheck, setShowMultiCheck] = useState(false);
  const [isCheckSelectAll, setIsCheckSelectAll] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);
  const [secretPassword, setSecretPassword] = useState("");

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
  console.log("selectedIds.length", selectedIds.length);
  console.log("aid", selectedIds);

  useEffect(() => {
    if (selectedIds.length === data.length) {
      setIsCheckSelectAll(true);
    } else {
      setIsCheckSelectAll(false);
    }
  }, [selectedIds]);

  useEffect(() => {
    if (showMultiCheck) {
      navigation.navigate("Ghi chú", { showMultiCheck: showMultiCheck });
    } else {
      navigation.navigate("BottomBar", {
        screen: "Ghi chú",
      });
    }
  }, [showMultiCheck]);

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
      Alert.alert("Xóa ghi chú", "Xóa ghi chú này khỏi danh sách ghi chú ?", [
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
        detail = "Thêm ghi chú này vào mục yêu thích?";
      } else {
        title = "Loại bỏ mục yêu thích";
        detail = "Loại bỏ ghi chú này từ mục yêu thích?";
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

  function moveToSecretFolder() {
    NoteService.updateSecretFolder(selectedIds);
    const ids = selectedIds.map((item) => item.id);
    const newData = data.filter((item) => !ids.includes(item.id));
    setData(newData);
    setShowMultiCheck(false);
    setIsCheckSelectAll(false);
    setSelectedIds([]);
  }

  const AlertCreatPass = () => {
    Alert.alert(
      "Bạn chưa thiết lập mật mã",
      "Bạn có muốn tạo mật mã thư mục bảo mật không?",
      [
        {
          text: "Đồng ý",
          onPress: () => {
            navigation.navigate("UnlockFolderSecret", {
              secretPassword,
            });
          },
        },
        {
          text: "Hủy",
          onPress: () => {
            toggleCheckBox("reset");
          },
        },
      ]
    );
  };

  const AlertSecret = () => {
    if (selectedIds.length > 0) {
      Alert.alert(
        "Thêm vào thư mục bảo mật",
        "Thêm ghi chú này vào thư mục bảo mật?",
        [
          {
            text: "Đồng ý",
            onPress: () => {
              if (secretPassword === "") {
                AlertCreatPass();
              } else {
                setShowUnlockSecretFolder(true);
              }
            },
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

  const [showUnlockSecretFolder, setShowUnlockSecretFolder] = useState(false);
  const [passwordUnlock, setPasswordUnlock] = useState("");

  async function openSecretFolder() {
    if (passwordUnlock === "") {
      Alert.alert("Không thể di chuyển thư mục", "Vui lòng nhập mật mã!", [
        {
          text: "Đồng ý",
          onPress: () => {
            setPasswordUnlock("");
            setShowUnlockSecretFolder(true);
          },
        },
      ]);
    } else if (passwordUnlock != "") {
      const isAuth = await NoteService.login(passwordUnlock, secretPassword);
      console.log("isAuth: ", isAuth);
      if (isAuth) {
        moveToSecretFolder();
        setPasswordUnlock("");
        setShowMultiCheck(false);
      } else {
        Alert.alert("Không thể di chuyển thư mục", "Sai mật mã!", [
          {
            text: "Đồng ý",
            onPress: () => {
              setPasswordUnlock("");
              setShowUnlockSecretFolder(true);
            },
          },
        ]);
      }
    }
  }

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

  const handleSortLoved = () => {
    const sortedNote6 = data.sort((a, b) => {
      if (a.isLoved && !b.isLoved) {
        return -1;
      } else if (!a.isLoved && b.isLoved) {
        return 1;
      }

      // Giữ nguyên thứ tự của các phần tử khác
      return 0;
    });
    if (selectedCategorySort === "SortLoved") {
      handleSortCreatedDay();
      setSelectedCategorySort("NotSortLoved");
      setShowExtends(false);
    } else {
      setData(sortedNote6);
      setSelectedCategorySort("SortLoved");
      setShowExtends(false);
    }
  };

  const [filterData, setFilterData] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [search, setSearch] = useState("");

  const searchFilter = (text) => {
    if (text) {
      const newData = data.filter((item) => {
        const itemData =
          (item.note ? item.note.toUpperCase() : "".toUpperCase()) +
          (item.title ? item.title.toUpperCase() : "".toUpperCase());
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      setFilterData(newData);
      setSearch(text);
    } else {
      setFilterData(data);
      setSearch(text);
    }
  };

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView className="flex-1">
        <View
          className={`bg-[#3A4666] justify-between items-center flex-row pl-4 ${
            !showMultiCheck && !showSearchBar ? "pr-1" : "pr-4"
          } ${showSearchBar ? "h-[60px]" : "h-[8%]"}`}
        >
          {showMultiCheck && !showSearchBar ? (
            <View>
              <TouchableOpacity
                className="items-center justify-center"
                onPress={() => {
                  setIsCheckSelectAll(!isCheckSelectAll);
                  toggleCheckBox("all");
                }}
              >
                {isCheckSelectAll ? (
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                ) : (
                  <Ionicons name="ellipse-outline" size={20} color="white" />
                )}
              </TouchableOpacity>
              {showMultiCheck && (
                <Text className="text-white text-[10px]">Tất cả</Text>
              )}
            </View>
          ) : !showMultiCheck && showSearchBar ? (
            <TouchableOpacity
              onPress={() => {
                setShowSearchBar(false);
                setFilterData(data);
              }}
              className="pr-1"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="white"
              />
            </TouchableOpacity>
          ) : (
            <View className="w-4 h-4"></View>
          )}
          {showMultiCheck && !showSearchBar ? (
            selectedIds.length > 0 ? (
              <Text className="text-white text-xl font-medium text-center">
                Đã chọn {selectedIds.length}
              </Text>
            ) : (
              <Text className="text-white text-xl font-medium text-center">
                Chọn ghi chú
              </Text>
            )
          ) : !showMultiCheck && showSearchBar ? (
            <View className="flex-row justify-between items-center bg-white rounded-xl pr-2 flex-1">
              <TextInput
                className="pl-2 bg-white rounded-xl w-[90%]"
                placeholder="Tìm kiếm"
                value={search}
                onChangeText={(text) => searchFilter(text)}
                onSubmitEditing={() => {
                  searchFilter(search);
                }}
              ></TextInput>
              <Ionicons
                onPress={() => searchFilter("")}
                name="close"
                size={28}
                color="black"
              />
            </View>
          ) : (
            <Text className="text-white text-[22px] font-semibold text-center">
              Danh sách ghi chú
            </Text>
          )}

          {showMultiCheck && !showSearchBar ? (
            <TouchableOpacity
              onPress={() => {
                toggleCheckBox("reset");
              }}
            >
              <MaterialCommunityIcons name="check" size={28} color="white" />
            </TouchableOpacity>
          ) : !showMultiCheck && showSearchBar ? (
            <View className="w-7 h-7"></View>
          ) : (
            <View className="flex-row justify-between items-center">
              <TouchableOpacity
                onPress={() => {
                  setShowSearchBar(!showSearchBar);
                  searchFilter("");
                }}
              >
                <Ionicons name="ios-search-sharp" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowExtends(true)}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={28}
                  color="white"
                />
              </TouchableOpacity>
            </View>
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
              <View className="w-52 h-48 bg-white rounded-lg">
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
                  onPress={handleSortLoved}
                  className="flex-1 flex-row justify-start items-center"
                >
                  {selectedCategorySort === "SortLoved" ? (
                    <Text className="ml-7">Bỏ ghim mục yêu thích</Text>
                  ) : (
                    <Text className="ml-7">Ghim mục yêu thích</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("UnlockFolderSecret", {
                      secretPassword,
                    });
                  }}
                  className="flex-1 flex-row justify-start items-center"
                >
                  <Text className="ml-7">Thư mục bảo mật</Text>
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

        {filterData.length === 0 && showSearchBar ? (
          <View className="flex-1 justify-center items-center">
            <Text>Không tìm thấy kết quả</Text>
          </View>
        ) : (
          <View className="flex-1 bg-[#F1F5F9]">
            <View className={`${showSearchBar ? "h-[100%]" : "h-[80%]"}`}>
              <ScrollView
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {(showSearchBar ? filterData : data).map(
                  (item) => (
                    (replaceHTML = item.note.replace(/<(.|\n)*?>/g, "").trim()),
                    (replaceWhiteSpace = replaceHTML
                      .replace(/&nbsp;/g, "")
                      .trim()),
                    (
                      <View key={item.id} className="mb-5 m-[4%] w-[42%]">
                        <TouchableOpacity
                          disabled={showMultiCheck ? true : false}
                          onLongPress={() => setShowMultiCheck(true)}
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
                            {showMultiCheck && (
                              <View className="w-5 h-5"></View>
                            )}
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
                          <Text className="text-sm font-normal">
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
        )}
        {showMultiCheck && !showSearchBar ? (
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={AlertSecret}
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
                name="folder-lock"
                size={20}
                color="white"
              />
              <Text className="text-white text-center font-semibold text-sm">
                Bảo mật
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
        ) : !showMultiCheck && showSearchBar ? (
          <View></View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("NoteList_Add", { isSecret: false });
            }}
            className="w-[90%] h-[5.5%] absolute bottom-[2%] ml-[5%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
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
        {/* Nhập pass chuyển vào thư mục bảo mật */}
        {showUnlockSecretFolder && (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View className="bg-white justify-center items-center rounded-xl p-5">
              <Text className="text-lg font-bold text-[#3A4666]">
                Mở khóa thư mục bảo mật
              </Text>
              <TextInput
                placeholder="Nhập mật mã"
                className="bg-[#FFFFFF] w-64 px-4 py-3 text-base resize-none border-b-[#9A999B] border-b-2 mt-2 mb-8"
                value={passwordUnlock}
                onChangeText={(text) => setPasswordUnlock(text)}
              ></TextInput>
              <View className="flex-row justify-between items-center space-x-5">
                <TouchableOpacity
                  className="w-[35%] justify-center items-center rounded-xl bg-white"
                  style={{
                    shadowColor: "#000000",
                    shadowOffset: { width: 5, height: 5 },
                    shadowOpacity: 0.5,
                    shadowRadius: 5,
                    elevation: 5,
                  }}
                  onPress={() => {
                    toggleCheckBox("reset");
                    setPasswordUnlock("");
                    setShowUnlockSecretFolder(false);
                  }}
                >
                  <Text className="font-semibold text-base text-[#3A4666]">
                    Thoát
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-[35%] justify-center items-center rounded-xl bg-[#3A4666]"
                  style={{
                    shadowColor: "#000000",
                    shadowOffset: { width: 5, height: 5 },
                    shadowOpacity: 0.5,
                    shadowRadius: 5,
                    elevation: 5,
                  }}
                  onPress={() => {
                    openSecretFolder();
                    setShowUnlockSecretFolder(false);
                  }}
                >
                  <Text className="font-semibold text-base text-white">
                    Di chuyển
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default NoteListMain;
