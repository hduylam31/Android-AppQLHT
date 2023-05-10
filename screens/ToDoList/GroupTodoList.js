import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CheckBox } from "@rneui/themed";

const GroupTodoList = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const route = useRoute();
  const { paramMoveData } = route.params;
  const [moveData, setMoveData] = useState(false);

  useEffect(() => {
    if (paramMoveData === "MoveData") {
      setMoveData(true);
      setShowMultiCheck(true);
    } else {
      setMoveData(false);
      setShowMultiCheck(false);
    }
  }, [route]);

  data = [
    { id: 1, title: "Danh sách công việc 1" },
    {
      id: 2,
      title: "DS công việc",
    },
    { id: 3, title: "AS công việc" },
    { id: 4, title: "DS công việc 2" },
    { id: 5, title: "DS công việc 5" },
  ];
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

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleCheckBox = (id) => {
    console.log("id", id);
    if (id === "all") {
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

  const AlertDelete = () => {
    Alert.alert(
      "Xóa công việc",
      "Xóa công việc này khỏi danh sách công việc? ?",
      [
        {
          text: "Đồng ý",
          // onPress: handleDeleteTodolist,
        },
        {
          text: "Hủy",
          onPress: () => {
            setShowMultiCheck(false);
            // toggleCheckBox("reset");
          },
        },
      ]
    );
  };

  return (
    <TouchableWithoutFeedback>
      {/* Thanh bar tiêu đề và điều hướng */}
      <SafeAreaView className="flex-1">
        <View className="bg-[#3A4666] h-[10%]">
          <View className="p-4">
            <View className="flex-row justify-between items-center">
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
                      <Ionicons
                        name="checkmark-circle"
                        size={32}
                        color="white"
                      />
                    ) : (
                      <Ionicons
                        name="ellipse-outline"
                        size={32}
                        color="white"
                      />
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <MaterialCommunityIcons
                    name="arrow-left"
                    size={32}
                    color="white"
                  />
                </TouchableOpacity>
              )}
              {showMultiCheck ? (
                selectedIds.length > 0 ? (
                  <Text className="text-white text-2xl font-bold text-center">
                    Đã chọn {selectedIds.length}
                  </Text>
                ) : (
                  <Text className="text-white text-2xl font-bold text-center">
                    Chọn công việc
                  </Text>
                )
              ) : (
                <Text className="text-white text-2xl font-bold text-center">
                  Nhóm công việc
                </Text>
              )}
              {showMultiCheck && moveData ? (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <MaterialCommunityIcons
                    name="arrow-left"
                    size={32}
                    color="white"
                  />
                </TouchableOpacity>
              ) : showMultiCheck && !moveData ? (
                <TouchableOpacity
                  onPress={() => {
                    setShowMultiCheck(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={32}
                    color="white"
                  />
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
                  <View className="w-52 h-24 bg-white rounded-lg">
                    <TouchableOpacity
                      onPress={() => {
                        setShowMultiCheck(true);
                        setShowExtends(false);
                      }}
                      className="flex-1 flex-row justify-start items-center"
                    >
                      <Text className="ml-7">Chọn công việc</Text>
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
            </View>
            {showMultiCheck && (
              <Text className="text-xs text-white">Tất cả</Text>
            )}

            {/* Phần tiêu đề */}
          </View>
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
                  <View key={item.id} className="mb-5 m-[4%] w-[25%] ">
                    {showMultiCheck ? (
                      <View className="h-20 bg-white rounded-xl">
                        <View className="h-5 flex justify-center items-center rounded-t-xl bg-[#a6a2a1]"></View>
                        <CheckBox
                          checked={selectedIds.includes(item.id)}
                          onPress={() => toggleCheckBox(item.id)}
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
                        onPress={() => {
                          navigation.navigate("GroupTodoListEdit");
                        }}
                        className="h-20 bg-white rounded-xl"
                      >
                        <View className="h-5 flex justify-center items-center rounded-t-xl bg-[#a6a2a1]"></View>
                      </TouchableOpacity>
                    )}

                    <View className="w-24">
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
        {showMultiCheck && !moveData && (
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
        )}
        {showMultiCheck && moveData && (
          <TouchableOpacity
            onPress={() => {
              setShowMultiCheck(false);
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
              Di chuyển
            </Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default GroupTodoList;
