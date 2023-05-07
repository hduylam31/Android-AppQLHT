import { View, Text, TouchableOpacity, FlatList, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  useNavigation,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { CheckBox } from "@rneui/themed";
import { AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import TodolistService from "../../service/TodolistService";

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
    const sortedTodos = todolists.sort((a, b) => {
      return toMinutes(a.hour) - toMinutes(b.hour);
    });
    setTodos(sortedTodos);
  }, [todolists]);

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
        className="border-b-[#f3f2f4] border-b-2 flex flex-row justify-between content-center"
      >
        <View className="flex-row w-[82%] justify-center items-center">
          {/* <CheckBox
            checked={item.isSelected}
            onPress={() => toggleSelect(item.id)}
            iconType="ionicon"
            checkedIcon="checkmark-circle"
            uncheckedIcon="ellipse-outline"
            checkedColor="#4A3780"
            size={20}
            center={true}
          /> */}
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

            <Text className={"text-xs font-normal "}>{item.hour}</Text>
          </View>
        </View>

        <CheckBox
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
      onPress={() => {
        navigation.navigate("TodoList_Edit", { item });
      }}
    >
      <Animatable.View
        animation="slideInLeft"
        delay={index * 10}
        style={{ flex: 1 }}
        className="w-full border-b-[#f3f2f4] border-b-2 flex-row justify-between content-center"
      >
        <View className="flex flex-row w-[82%] opacity-50 justify-center items-center">
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

  const [multiCheck, setMultiCheck] = useState();

  // const toggleSelect = (id) => {
  //   setData((prevData) =>
  //     prevData.map((item) => {
  //       if (item.id === id) {
  //         return { ...item, isSelected: !item.isSelected };
  //       } else {
  //         return item;
  //       }
  //     })
  //   );
  // };

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className=" bg-[#3A4666] h-[10%]">
        <View className="flex-row p-4 justify-between items-center">
          <View className="w-8 h-8 "></View>
          <Text className="text-white text-2xl font-bold text-center">
            Danh sách công việc
          </Text>
          <TouchableOpacity onPress={() => setShowExtends(true)}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={32}
              color="white"
            />
          </TouchableOpacity>
          <Modal
            visible={showExtends}
            transparent={true}
            animationType="fade"
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
                    navigation.navigate("CalendarExtendTimeNoti");
                  }}
                  className="flex-1 justify-center items-center"
                >
                  <Text>Thời gian thông báo</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 justify-center items-center">
                  <Text>Sắp xếp theo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("CalendarExtendMoodleEvent");
                  }}
                  className="flex-1 justify-center items-center"
                >
                  <Text>Xem tất cả sự kiện moodle</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        {/* <View className="flex-row justify-between p-4">
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={32}
              color="white"
            />
          </TouchableOpacity>
          <View className="flex items-center justify-center">
            
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </View> */}
      </View>
      <View className="flex-1 bg-[#F1F5F9]">
        {/* Công việc hiện có  */}
        <View
          className="w-[90%] h-[38%] bg-white rounded-2xl mx-[5%] mt-[5%]"
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
    </SafeAreaView>
  );
};

export default ToDoListScreen;
