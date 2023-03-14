<<<<<<< HEAD
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { todosData } from "../data/todos";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { CheckBox } from "@rneui/themed";

const ToDoListScreen = () => {
  const navigation = useNavigation();
  const [todos, setTodos] = useState(todosData);

  const handleToggleCompleted = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
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

  renderItem = ({ item }) => (
    <View className="w-full h-16 border-b-[#f3f2f4] border-b-2 my-1 flex flex-row justify-between content-center">
      <View className="flex flex-row ">
        <View className="ml-5 w-11 h-11 bg-[#E7E2F3] rounded-full mx-3 flex items-center justify-center">
          <MaterialCommunityIcons
            name="calendar-today"
            size={24}
            color="#4A3780"
          />
        </View>
        <View>
          <Text className={"text-lg font-semibold"}>{item.text}</Text>
          <Text className={"font-normal "}>{item.hour}</Text>
        </View>
      </View>
      <View className="flex flex-row ">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("TodoList_Edit");
          }}
          className="mt-4"
        >
          <MaterialCommunityIcons
            name="pencil-outline"
            size={30}
            color="#4A3780"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleToggleCompleted(item.id)}>
          <CheckBox
            checked={item.isCompleted}
            onPress={() => handleToggleCompleted(item.id)}
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor="#4A3780"
            size={32}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  renderItemCompleted = ({ item }) => (
    <View className="w-full h-16 border-b-[#f3f2f4] border-b-2 my-1 flex flex-row justify-between content-center">
      <View className="flex flex-row opacity-50 ">
        <View className="ml-5 w-11 h-11 bg-[#E7E2F3] rounded-full mx-3 flex items-center justify-center">
          <MaterialCommunityIcons
            name="calendar-today"
            size={24}
            color="#4A3780"
          />
        </View>
        <View>
          <Text className={"text-lg font-semibold line-through "}>
            {item.text}
          </Text>
          <Text className={"font-normal line-through "}>{item.hour}</Text>
        </View>
      </View>

      <CheckBox
        checked={item.isCompleted}
        onPress={() => handleToggleCompleted(item.id)}
        iconType="material-community"
        checkedIcon="checkbox-marked"
        uncheckedIcon="checkbox-blank-outline"
        checkedColor="#4A3780"
        size={32}
      />
    </View>
  );
  return (
    <SafeAreaView className="flex-1 bg-[#F1F5F9] h-[50%]">
      <View className=" bg-[#3A4666] w-full h-[25%]">
        <View className="flex-row justify-between my-[7%] mx-[3%] ">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={32}
              color="white"
            />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold mt-1">
            T10 20, 2022
          </Text>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <Text className="text-white text-3xl font-bold text-center">
          Danh sách công việc
        </Text>
        <View className="w-[90%] h-60 bg-white rounded-2xl mx-[5%] mt-10 flex flex-row items-center">
          <FlatList
            data={todos.filter((todo) => !todo.isCompleted)}
            renderItem={this.renderItem}
          />
        </View>
        <Text className="text-lg font-semibold ml-[5%] my-[5%]">
          Hoàn thành
        </Text>
        <View className="w-[90%] h-32 bg-white rounded-2xl mx-[5%] flex flex-row items-center">
          <FlatList
            data={todos.filter((todo) => todo.isCompleted)}
            renderItem={this.renderItemCompleted}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("TodoList_Add");
        }}
        className="w-[80%] h-14 absolute bottom-5 ml-[10%] bg-[#3A4666] rounded-2xl flex basis-1/12 items-center justify-center"
      >
        <Text className="text-white text-center font-bold text-xl">
          Thêm công việc
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ToDoListScreen;
=======
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { todosData } from "../data/todos";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { CheckBox } from "@rneui/themed";
import { AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

const CategoryView = ({ label }) => (
  <View
    className={`ml-5 w-11 h-11 rounded-full mx-3 flex items-center justify-center ${
      label === "profile" ? "bg-[#DBECF6]" : ""
    }
    ${label === "dotchart" ? "bg-[#E7E2F3]" : ""}
    ${label === "Trophy" ? "bg-[#FEF5D3]" : ""}`}
  >
    <AntDesign name={label} size={25} color="black" />
  </View>
);
const ToDoListScreen = () => {
  const navigation = useNavigation();
  const [todos, setTodos] = useState(
    todosData.sort((a, b) => {
      return toMinutes(a.hour) - toMinutes(b.hour);
    })
  );

  const handleToggleCompleted = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
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
    <Animatable.View
      animation={index % 2 === 0 ? "slideInRight" : "slideInLeft"}
      delay={index * 10}
      className="w-full h-16 border-b-[#f3f2f4] border-b-2 my-1 flex flex-row justify-between content-center"
    >
      <View className="flex flex-row ">
        <CategoryView label={item.category} />
        <View>
          <Text className={"text-lg font-semibold"}>{item.text}</Text>
          <Text className={"font-normal "}>{item.hour}</Text>
        </View>
      </View>
      <View className="flex flex-row ">
        <TouchableOpacity className="mt-4">
          <MaterialCommunityIcons
            name="pencil-outline"
            size={30}
            color="#4A3780"
          />
        </TouchableOpacity>

        <CheckBox
          checked={item.isCompleted}
          onPress={() => handleToggleCompleted(item.id)}
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          checkedColor="#4A3780"
          size={32}
        />
      </View>
    </Animatable.View>
  );
  renderItemCompleted = ({ item, index }) => (
    <Animatable.View
      animation={index % 2 === 0 ? "slideInRight" : "slideInLeft"}
      delay={index * 10}
      style={{ flex: 1 }}
      className="w-full h-16 border-b-[#f3f2f4] border-b-2 my-1 flex-row justify-between content-center"
    >
      <View className="flex flex-row opacity-50 ">
        <CategoryView label={item.category} />
        <View>
          <Text className={"text-lg font-semibold line-through "}>
            {item.text}
          </Text>
          <Text className={"font-normal line-through "}>{item.hour}</Text>
        </View>
      </View>

      <CheckBox
        checked={item.isCompleted}
        onPress={() => handleToggleCompleted(item.id)}
        iconType="material-community"
        checkedIcon="checkbox-marked"
        uncheckedIcon="checkbox-blank-outline"
        checkedColor="#4A3780"
        size={32}
      />
    </Animatable.View>
  );
  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="flex-1 bg-[#3A4666] w-full h-[25%]">
        <View className="flex-row justify-between mt-[7%] mx-[3%] ">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={32}
              color="white"
            />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold mt-1">
            T10 20, 2022
          </Text>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <View className="flex items-center justify-center h-[10]%">
          <Text className="text-white text-3xl font-bold text-center">
            Danh sách công việc
          </Text>
        </View>

        <View className="flex-1 bg-[#F1F5F9]">
          {/* Công việc hiện có  */}
          <View className="w-[90%] h-60 bg-white rounded-2xl mx-[5%] mt-10 flex flex-row items-center">
            <FlatList
              data={todos.filter((todo) => !todo.isCompleted)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={this.renderItem}
            />
          </View>
          {/* Công việc đã hòan thành */}
          <Text className="text-lg font-semibold ml-[5%] my-[5%]">
            Hoàn thành
          </Text>
          <View className="w-[90%] h-40 bg-white rounded-2xl mx-[5%] flex flex-row items-center">
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
        className="w-[80%] h-14 absolute bottom-5 ml-[10%] bg-[#3A4666] rounded-2xl flex items-center justify-center"
      >
        <Text className="text-white text-center font-bold text-xl">
          Thêm công việc
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ToDoListScreen;
>>>>>>> FE-Khoa2