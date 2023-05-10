import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  useNavigation,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { CheckBox } from "@rneui/themed";
import { AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import TodolistService from "../../service/TodolistService";
import { SelectCountry } from "react-native-element-dropdown";

function toMinutes(time) {
  if (time === "") {
    return -1;
  }
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

const CategoryView = ({ label }) => (
  <View
    className={`w-8 h-8 rounded-full flex items-center justify-center mr-2
      ${label === "profile" ? "bg-[#DBECF6]" : ""}
      ${label === "dashboard" ? "bg-[#E7E2F3]" : ""}
      ${label === "Trophy" ? "bg-[#FEF5D3]" : ""}}
      ${label === "ellipsis1" ? "bg-[#FEF5D3]" : ""}`}
  >
    <AntDesign name={label} size={18} color="black" />
  </View>
);
const GroupTodoListEdit = () => {
  const navigation = useNavigation();

  //======= BE: lấy data todolist của account đang đăng nhập =========
  const [todolists, setTodolists] = useState([]);
  const [todos, setTodos] = useState([]);

  const loadTodolist = async () => {
    const todolists = await TodolistService.loadTodolist();
    setTodolists(todolists);
    console.log("todolist2: ", todolists);
  };

  useEffect(() => {
    loadTodolist();
  }, []);

  const route = useRoute();
  useEffect(() => {
    if (
      route?.params?.screenTodoList === "AddToMain" ||
      route?.params?.screenTodoList === "EditToMain" ||
      route?.params?.screenTodoList === "DeleteToMain"
    ) {
      loadTodolist();
    }
  }, [route]);

  useEffect(() => {
    if (selectedCategorySort === "SortZa") {
      handleSortZA();
    } else if (selectedCategorySort === "SortAZ") {
      handleSortAZ();
    } else if (selectedCategorySort === "SortTime") {
      handleSortTime();
    } else {
      handleSortTime();
    }
  }, [todolists]);

  const handleSortTime = () => {
    const sortedTodos = todolists.sort((a, b) => {
      return toMinutes(a.hour) - toMinutes(b.hour);
    });
    setTodos(sortedTodos);
    setSelectedCategorySort("SortTime");
    setShowExtendsSort(false);
    setShowExtends(false);
  };

  const handleSortAZ = () => {
    const sortedTodos2 = todolists.sort((a, b) => {
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
    const sortedTodos3 = todolists.sort((a, b) => {
      const aTitle = a.title.split(" ")[0].charAt(0);
      const bTitle = b.title.split(" ")[0].charAt(0);
      return bTitle.localeCompare(aTitle);
    });
    setTodos(sortedTodos3);
    setSelectedCategorySort("SortZA");
    setShowExtendsSort(false);
    setShowExtends(false);
  };

  // ===========================================================================

  const handleToggleCompleted = (item) => {
    TodolistService.updateCompletedStatus(item);
    const updatedTodos = todos.map((todo) => {
      if (todo.id === item.id) {
        return { ...todo, isCompleted: !todo.isCompleted };
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
    setTodolists(updatedTodos);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const ListEmptyComponent = () => (
    <View className="flex h-64 justify-center items-center">
      <Text className="text-base">Bạn chưa có công việc nào!</Text>
    </View>
  );

  renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("TodoList_Edit", { item });
      }}
    >
      <Animatable.View
        animation="slideInLeft"
        delay={index * 10}
        className="border-b-[#f3f2f4] border-b-2 flex-row justify-between content-center h-14"
      >
        <View className="flex-row w-[80%] justify-center items-center">
          {showMultiCheck && (
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
          )}
          <CategoryView label={item.category} />
          <View className="w-[70%]">
            <View className="flex-row">
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className={"font-semibold text-base"}
              >
                {item.title}
              </Text>
              <View className={"mt-1 ml-1"}>
                {item.isNotified && (
                  <MaterialCommunityIcons
                    name="bell-ring-outline"
                    size={16}
                    color="black"
                  />
                )}
              </View>
            </View>

            <Text className={"text-xs font-normal"}>{item.hour}</Text>
          </View>
        </View>
      </Animatable.View>
    </TouchableOpacity>
  );

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
    if (id === "all") {
      setSelectedIds(isCheckSelectAll ? [] : todos.map((item) => item.id));
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
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className=" bg-[#3A4666] h-[10%]">
        <View className="p-4">
          <View className="justify-between items-center flex-row">
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
                Danh sách công việc
              </Text>
            )}
            <TouchableOpacity onPress={() => setShowExtends(true)}>
              <MaterialCommunityIcons
                name="dots-vertical"
                size={32}
                color="white"
              />
            </TouchableOpacity>

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
            </Modal>
          </View>
          {showMultiCheck && <Text className="text-xs text-white">Tất cả</Text>}
        </View>
      </View>
      <View className="flex-1 bg-[#F1F5F9]">
        {/* Công việc hiện có  */}
        <View
          className="w-[90%] bg-white rounded-2xl mx-[5%] mt-4"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={this.renderItem}
            ListEmptyComponent={ListEmptyComponent}
          />
        </View>
      </View>

      {showMultiCheck ? (
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => {
              setShowMultiCheck(false);
            }}
            className="w-[43%] h-10 absolute bottom-5 left-[5%] bg-[#3A4666] rounded-2xl flex-row items-center justify-center space-x-2"
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
          <TouchableOpacity
            onPress={() => {
              setShowMultiCheck(false);
            }}
            className="w-[43%] h-10 absolute bottom-5 left-[52%] bg-[#c12d2d] rounded-2xl flex-row items-center justify-center space-x-2"
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
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("TodoList_Add");
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
            Thêm công việc
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
                onPress={() => setShowSaveWorkGroup(false)}
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
                onPress={() => setShowSaveWorkGroup(false)}
              >
                <Text className="font-semibold text-base text-white">Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default GroupTodoListEdit;
