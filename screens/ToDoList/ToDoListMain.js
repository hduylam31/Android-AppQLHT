import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
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
const ToDoListScreen = () => {
  const navigation = useNavigation();

  //======= BE: lấy data todolist của account đang đăng nhập =========
  const [todolists, setTodolists] = useState([]);
  const [todos, setTodos] = useState([]);
  const [groupName, setGroupName] = useState("Mặc định");

  const loadTodolist = async () => {
    console.log("load load load........");
    const todolistInfo = await TodolistService.loadTodolist();
    if (todolistInfo != null) {
      const usingTodolists = todolistInfo.usingTodolists;
      setTodolists(usingTodolists);
      setGroupName(todolistInfo.usingGroupName);
      console.log("todolist2: ", todolistInfo); 
    }
    setSelectedIds([]);
  };

  useEffect(() => { 
    loadTodolist();
  }, []);
 
  const route = useRoute();

  useEffect(() => {
    async function triggerGroupProcess() {
      var usingGroupName = route?.params?.usingGroupName;      
      if (usingGroupName) { 
        var data = await TodolistService.loadNotificationAndUpdateDbByGroupName(
          usingGroupName 
        );  
        console.log("usingGroupName: ", usingGroupName); 
        console.log("New data: ", data);
        setTodolists(data);  
        setTodos(data);    
        setGroupName(usingGroupName);   
      }

      var movedItems = route?.params?.movedItems; 
      if (movedItems) { 
        var movedItemIds = movedItems.map((item) => item.id);
        var newTodolist = todolists.filter( 
          (item) => !movedItemIds.includes(item.id) 
        );
        setTodolists(newTodolist); 
        setTodos(newTodolist);
      }
      setSelectedIds([]);
    }
    triggerGroupProcess();
  }, [route]);

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
      disabled={showMultiCheck ? true : false}
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
              checked={selectedIds.includes(item)}
              onPress={() => toggleCheckBox(item)}
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

        <CheckBox
          disabled={showMultiCheck ? true : false}
          checked={item.isCompleted}
          onPress={() => handleToggleCompleted(item)}
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          checkedColor="#4A3780"
          size={20}
        />
      </Animatable.View>
    </TouchableOpacity>
  );
  renderItemCompleted = ({ item, index }) => (
    <TouchableOpacity
      disabled={showMultiCheck ? true : false}
      onPress={() => {
        navigation.navigate("TodoList_Edit", { item });
      }}
    >
      <Animatable.View
        animation="slideInLeft"
        delay={index * 10}
        style={{ flex: 1 }}
        className="w-full border-b-[#f3f2f4] border-b-2 flex-row justify-between content-center h-14"
      >
        <View className="flex-row w-[80%] opacity-50 justify-center items-center">
          {showMultiCheck && (
            <CheckBox
              checked={selectedIds.includes(item)}
              onPress={() => toggleCheckBox(item)}
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
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className={"text-base font-semibold line-through"}
            >
              {item.title}
            </Text>

            <Text className={"text-xs font-normal line-through"}>
              {item.hour}
            </Text>
          </View>
        </View>

        <CheckBox
          disabled={showMultiCheck ? true : false}
          checked={item.isCompleted}
          onPress={() => handleToggleCompleted(item)}
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          checkedColor="#4A3780"
          size={20}
        />
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
    if (id === "reset") {
      setShowMultiCheck(false);
      setIsCheckSelectAll(false);
      setSelectedIds([]);
    } else if (id === "all") {
      setSelectedIds(isCheckSelectAll ? [] : todos.map((item) => item));
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
  const Data = [
    { key: "Mặc định", value: "1" },
    { key: "DS Công việc", value: "2" },
    { key: "Thêm công việc", value: "3" },
  ];
  const [listGroup, setListGroup] = useState("1");

  function handleDeleteTodolist() {
    if (selectedIds.length > 0) {
      TodolistService.deleteTodolists(selectedIds);
      console.log("Delete OK");
      var deleteIds = selectedIds.map((item) => item.id);
      var newTodolist = todolists.filter(
        (item) => !deleteIds.includes(item.id)
      );
      setTodolists(newTodolist);
      setTodos(newTodolist);
    } else {
      Alert.alert("Thông báo", "Vui lòng chọn tối thiểu một công việc");
    }
    setSelectedIds([]);
  }

  const AlertDelete = () => {
    Alert.alert(
      "Xóa công việc",
      "Xóa công việc này khỏi danh sách công việc? ?",
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
  };

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
              <View className="w-8 h-8"></View>
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
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("GroupTodoList", {
                        paramMoveData: "NoteMoveData",
                        usingGroupName: groupName,
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
        <View className="flex-row items-center justify-end space-x-3 pr-2">
          <Text className="text-sm">Nhóm CV: {groupName}</Text>
        </View>

        {/* Công việc hiện có  */}
        <View
          className="w-[90%] h-[38%] bg-white rounded-2xl mx-[5%] mt-4"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <FlatList
            data={todos.filter((todo) => !todo.isCompleted)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={this.renderItem}
            ListEmptyComponent={ListEmptyComponent}
          />
        </View>
        {/* Công việc đã hòan thành */}
        <Text className="text-base font-semibold ml-[5%] my-[3%]">
          Hoàn thành
        </Text>
        <View
          className="w-[90%] h-[38%] bg-white rounded-2xl mx-[5%]"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <FlatList
            data={todos.filter((todo) => todo.isCompleted)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={this.renderItemCompleted}
          />
        </View>
      </View>
      {showMultiCheck ? (
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => {
              setShowMultiCheck(false); 
              if (selectedIds.length > 0) {
                navigation.navigate("GroupTodoList", {
                  paramMoveData: "MoveData",
                  items: selectedIds,
                  usingGroupName: groupName,
                });
              } else {
                Alert.alert("Thông báo", "Vui lòng chọn ít nhất một công việc");
              }
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
              size={20}
              color="white"
            />
            <Text className="text-white text-center font-semibold text-sm">
              Di chuyển
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={AlertDelete}
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
            navigation.navigate("TodoList_Add", { groupName });
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
    </SafeAreaView>
  );
};

export default ToDoListScreen;
