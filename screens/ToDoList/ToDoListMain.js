import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { todosData } from "../../data/todos";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { CheckBox } from "@rneui/themed";
import { AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import TodolistService from "../../service/TodolistService";

function toMinutes(time) {
  if (time === "") {
    return null;
  }
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

const CategoryView = ({ label }) => (
  <View
    className={`w-8 h-8 rounded-full mx-3 mt-1 flex items-center justify-center 
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
  const isFocused = useIsFocused();

  console.log("Set todolist");

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

  useEffect(() => {
    if (isFocused) {
      loadTodolist();
    }
  }, [isFocused]);

  useEffect(() => {
    const sortedTodos = todolists.sort((a, b) => {
      return toMinutes(a.hour) - toMinutes(b.hour);
    });
    setTodos(sortedTodos);
  }, [todolists]);

  // ===========================================================================

  const handleToggleCompleted = (itemId) => {
    TodolistService.updateCompletedStatus(itemId);
    const updatedTodos = todos.map((todo) => {
      if (todo.id === itemId) {
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

  renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("TodoList_Edit", {
          c_id: item.id,
          c_title: item.title,
          c_category: item.category,
          c_isNotified: item.isNotified,
          c_hour: item.hour,
          c_text: item.text,
          c_isCompleted: item.isCompleted,
        });
      }}
    >
      <Animatable.View
        animation="slideInLeft"
        delay={index * 10}
        className="h-14 border-b-[#f3f2f4] border-b-2 my-1 flex flex-row justify-between content-center"
      >
        <View className="flex flex-row w-[82%]">
          <CategoryView label={item.category} />
          <View className="w-[70%]">
            <View className="flex-row">
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className={"text-base font-semibold"}
              >
                {item.title}
              </Text>

              <View className={"mt-1 ml-1"}>
                {item.isNotified && (
                  <MaterialCommunityIcons
                    name="bell-ring-outline"
                    size={14}
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
          onPress={() => handleToggleCompleted(item.id)}
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
        navigation.navigate("TodoList_Edit", {
          id: item.id,
          title: item.title,
          category: item.category,
          isNotified: item.isNotified,
          hour: item.hour,
          text: item.text,
          isCompleted: item.isCompleted,
        });
      }}
    >
      <Animatable.View
        animation="slideInLeft"
        delay={index * 10}
        style={{ flex: 1 }}
        className="w-full h-14 border-b-[#f3f2f4] border-b-2 my-1 flex-row justify-between content-center"
      >
        <View className="flex flex-row w-[82%] opacity-50">
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
          onPress={() => handleToggleCompleted(item.id)}
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          checkedColor="#4A3780"
          size={20}
        />
      </Animatable.View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="flex-1 bg-[#3A4666]">
        <View className="flex-row justify-between my-[7%] mx-[5%] ">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={32}
              color="white"
            />
          </TouchableOpacity>
          <View className="flex items-center justify-center">
            <Text className="text-white text-2xl font-bold text-center">
              Danh sách công việc
            </Text>
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-1 bg-[#F1F5F9]">
          {/* Công việc hiện có  */}
          <View className="w-[90%] h-[40%] bg-white rounded-2xl mx-[5%] mt-[5%] flex flex-row">
            <FlatList
              data={todos.filter((todo) => !todo.isCompleted)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={this.renderItem}
            />
          </View>
          {/* Công việc đã hòan thành */}
          <Text className="text-lg font-semibold ml-[5%] my-[3%]">
            Hoàn thành
          </Text>
          <View className="w-[90%] h-[40%] bg-white rounded-2xl mx-[5%] flex flex-row">
            <FlatList
              data={todos.filter((todo) => todo.isCompleted)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={this.renderItemCompleted}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("TodoList_Add");
        }}
        className="w-[70%] h-[5%] absolute bottom-2 ml-[15%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
      >
        <Text className="text-white text-center font-bold text-base">
          Thêm công việc
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ToDoListScreen;
