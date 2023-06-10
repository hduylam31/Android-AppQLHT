import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CheckBox } from "@rneui/themed";
import TodolistService from "../../service/TodolistService";

const GroupTodoList = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const route = useRoute();
  const { paramMoveData, usingGroupName, items } = route.params;
  console.log("items: ", items);
  const [moveData, setMoveData] = useState(false);
  const [data, setData] = useState([]);

  async function loadGroupNames() {
    const groupNames = await TodolistService.loadGroupNames();
    setData(groupNames);
    console.log("groupNames: ", groupNames);
    setSelectedIds([]);
  }
  useEffect(() => {
    loadGroupNames();
  }, []);

  useEffect(() => {
    if (paramMoveData === "MoveData") {
      setIsCheckSelectOne(true);
      setMoveData(true);
      setShowMultiCheck(true);
    } else {
      setMoveData(false);
      setShowMultiCheck(false);
    }
  }, [route]);

  // data = [
  //   { id: 1, title: "Danh sách công việc 1" },
  //   {
  //     id: 2,
  //     title: "DS công việc",
  //   },
  //   { id: 3, title: "AS công việc" },
  //   { id: 4, title: "DS công việc 2" },
  //   { id: 5, title: "DS công việc 5" },
  // ];
  const [todos, setTodos] = useState([]);
  const handleSortAZ = () => {
    const sortedTodos2 = data.sort((a, b) => {
      const aTitle = a.title.split(" ")[0].charAt(0);
      const bTitle = b.title.split(" ")[0].charAt(0);
      return aTitle.localeCompare(bTitle);
    });
    setTodos(sortedTodos2);
    setSelectedCategorySort("SortAZ");
    setShowExtendsSort(false);
    setShowExtends(false);
  };
  const handleSortZA = () => {
    const sortedTodos3 = data.sort((a, b) => {
      const aTitle = a.title.split(" ")[0].charAt(0);
      const bTitle = b.title.split(" ")[0].charAt(0);
      return bTitle.localeCompare(aTitle);
    });
    setTodos(sortedTodos3);
    setSelectedCategorySort("SortZA");
    setShowExtendsSort(false);
    setShowExtends(false);
  };

  // Hiển thị phần mở rộng
  const [showExtends, setShowExtends] = useState(false);
  const [showExtendsSort, setShowExtendsSort] = useState(false);
  const [selectedCategorySort, setSelectedCategorySort] = useState();

  const [showMultiCheck, setShowMultiCheck] = useState(false);
  const [isCheckSelectAll, setIsCheckSelectAll] = useState(false);
  const [isCheckSelectOne, setIsCheckSelectOne] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);
  const [showSaveWorkGroup, setShowSaveWorkGroup] = useState(false);
  const [nameSaveWorkGroup, setNameSaveWorkGroup] = useState("");

  async function saveGroupName() {
    if (nameSaveWorkGroup === "") {
      Alert.alert(
        "Thêm nhóm công việc không thành công",
        "Tên nhóm công việc không được bỏ trống"
      );
    } else {
      await TodolistService.saveGroupName(nameSaveWorkGroup);
      loadGroupNames();
    }
  }

  async function handleMoveData() {
    if (selectedIds.includes(usingGroupName)) {
      Alert.alert(
        "Thông báo",
        "Không thể di chuyển tới nhóm công việc hiện tại",
        [
          {
            text: "Đồng ý",
            onPress: () => {
              setSelectedIds([]);
              setShowMultiCheck(true);
            },
          },
        ]
      );
    } else {
      TodolistService.moveToOtherGroup(items, selectedIds[0]);
      navigation.navigate("BottomBar", {
        screen: "DS công việc",
        params: {
          movedItems: items,
        },
      });
    }
  }

  const toggleCheckBox = (title) => {
    console.log("title", title);
    if (title === "reset") {
      setShowMultiCheck(false);
      setIsCheckSelectAll(false);
      setSelectedIds([]);
    } else if (title === "all") {
      setSelectedIds(isCheckSelectAll ? [] : data.map((item) => item.title));
      setIsCheckSelectAll(!isCheckSelectAll);
    } else if (isCheckSelectOne) {
      console.log("selectedIds", selectedIds);
      if (selectedIds === null || selectedIds !== title) {
        // Nếu checkbox đã được chọn trước đó không phải là checkbox hiện tại, bỏ chọn nó và chọn checkbox hiện tại
        setSelectedIds([title]);
      } else {
        // Nếu checkbox đã được chọn trước đó là checkbox hiện tại, bỏ chọn nó
        setSelectedIds(null);
      }
    } else {
      if (selectedIds.includes(title)) {
        setSelectedIds(selectedIds.filter((item) => item !== title));
      } else {
        setSelectedIds([...selectedIds, title]);
      }
    }
  };

  console.log("selectedIds: ", selectedIds);

  useEffect(() => {
    if (selectedIds.length === data.length) {
      setIsCheckSelectAll(true);
    } else {
      setIsCheckSelectAll(false);
    }
  }, [selectedIds]);

  async function changeToAnotherGroup(groupName) {
    console.log(groupName);
    if (usingGroupName == groupName) {
      navigation.goBack();
    } else {
      TodolistService.changeUsingGroup(usingGroupName, groupName);
      navigation.navigate("BottomBar", {
        screen: "DS công việc",
        params: {
          usingGroupName: groupName,
        },
      });
    }
  }

  function handleDeleteTodolist() {
    if (selectedIds.includes(usingGroupName)) {
      Alert.alert("Thông báo", "Bạn không thể xóa nhóm công việc đang sử dụng");
    } else {
      TodolistService.deleteGroups(selectedIds);
      var newGroupNames = data.filter(
        (item) => !selectedIds.includes(item.title)
      );
      setData(newGroupNames);
      setShowMultiCheck(false);
    }
  }

  const AlertDelete = () => {
    if (selectedIds.length > 0) {
      Alert.alert(
        "Xóa nhóm công việc",
        "Xóa nhóm công việc này khỏi danh sách nhóm công việc ?",
        [
          {
            text: "Đồng ý",
            onPress: handleDeleteTodolist,
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
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một nhóm công việc");
    }
  };

  return (
    <TouchableWithoutFeedback>
      {/* Thanh bar tiêu đề và điều hướng */}
      <SafeAreaView className="flex-1">
        <View
          className={`bg-[#3A4666] justify-between items-center flex-row pl-4 h-[60px] ${
            showMultiCheck ? "pr-4" : "pr-1"
          }`}
        >
          {showMultiCheck && !isCheckSelectOne ? (
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
              {showMultiCheck && !isCheckSelectOne && (
                <Text className="text-white text-[10px]">Tất cả</Text>
              )}
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
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
                Chọn nhóm công việc
              </Text>
            )
          ) : (
            <Text className="text-white text-xl font-medium text-center">
              Nhóm công việc
            </Text>
          )}
          {showMultiCheck && moveData ? (
            <View className="w-7 h-7"></View>
          ) : showMultiCheck && !moveData ? (
            <TouchableOpacity
              onPress={() => {
                toggleCheckBox("reset");
              }}
            >
              <MaterialCommunityIcons name="check" size={28} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setShowExtends(true)}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={28}
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
              <View className="w-52 h-24 bg-white rounded-lg">
                <TouchableOpacity
                  onPress={() => {
                    setShowMultiCheck(true);
                    setShowExtends(false);
                  }}
                  className="flex-1 flex-row justify-start items-center"
                >
                  <Text className="ml-7">Chọn nhóm công việc</Text>
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
              <View className="w-52 h-36 bg-white rounded-lg">
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
                {/* <TouchableOpacity
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
                  </TouchableOpacity> */}
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
          </Modal>

          {/* Phần tiêu đề */}
        </View>

        <View className="bg-[#F1F5F9] h-full">
          <View className="h-full bg-[#F1F5F9]">
            <View className="h-[80%]">
              <ScrollView
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {data.map((item) => (
                  <View key={item.key} className="mb-5 m-[4%] w-[25%] ">
                    {showMultiCheck ? (
                      <View className="h-20 bg-white rounded-xl">
                        <View className="h-5 flex justify-center items-center rounded-t-xl bg-[#a6a2a1]"></View>
                        <CheckBox
                          checked={selectedIds.includes(item.title)}
                          onPress={() => toggleCheckBox(item.title)}
                          iconType="ionicon"
                          checkedIcon="checkmark-circle"
                          uncheckedIcon="ellipse-outline"
                          checkedColor="#4A3780"
                          size={20}
                          center={true}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => changeToAnotherGroup(item.title)}
                        className="h-20 bg-white rounded-xl"
                      >
                        <View className="h-5 flex justify-center items-center rounded-t-xl bg-[#a6a2a1]"></View>
                      </TouchableOpacity>
                    )}

                    <View className="w-24 justify-center items-center">
                      <Text numberOfLines={2} ellipsizeMode="tail">
                        {item.title}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
        {showMultiCheck && !moveData ? (
          <TouchableOpacity
            onPress={AlertDelete}
            className="w-[90%] h-10 absolute bottom-5 left-[5%] bg-[#c12d2d] rounded-2xl flex-row items-center justify-center space-x-2"
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
              size={24}
              color="white"
            />
            <Text className="text-white text-center font-bold text-base">
              Xóa
            </Text>
          </TouchableOpacity>
        ) : showMultiCheck && moveData ? (
          <TouchableOpacity
            onPress={() => {
              setShowMultiCheck(false);
              handleMoveData();
            }}
            className="w-[90%] h-10 absolute bottom-5 left-[5%] bg-[#3A4666] rounded-2xl flex-row items-center justify-center space-x-2"
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
              size={24}
              color="white"
            />
            <Text className="text-white text-center font-bold text-base">
              Lưu
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setShowSaveWorkGroup(true);
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
              Thêm nhóm công việc
            </Text>
          </TouchableOpacity>
        )}

        {/* Tạo nhóm công việc */}
        {showSaveWorkGroup && (
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
                Tạo nhóm công việc
              </Text>
              <TextInput
                placeholder="Tên nhóm công việc"
                className="bg-[#FFFFFF] w-64 px-4 py-3 text-base resize-none border-b-[#9A999B] border-b-2 mt-2 mb-8"
                value={nameSaveWorkGroup}
                onChangeText={(text) => setNameSaveWorkGroup(text)}
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
                    setShowSaveWorkGroup(false);
                    setNameSaveWorkGroup("");
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
                    setShowSaveWorkGroup(false);
                    saveGroupName();
                    setNameSaveWorkGroup("");
                  }}
                >
                  <Text className="font-semibold text-base text-white">
                    Thêm
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

export default GroupTodoList;
