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

const ToDoListScreen = ({ id, text, isCompleted, hour }) => {
  const navigation = useNavigation();
  // const [checked, setChecked] = React.useState(isCompleted);
  const [check1, setCheck1] = useState(true);

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

      <CheckBox
        // checked={checked.isCompleted}
        // onPress={() =>
        //   setChecked({ checked, isCompleted: !checked.isCompleted })
        // }
        // Use ThemeProvider to make change for all checkbox
        iconType="material-community"
        checkedIcon="checkbox-marked"
        uncheckedIcon="checkbox-blank-outline"
        checkedColor="#4A3780"
        size={32}
      />
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
        // checked={checked.isCompleted}
        // onPress={() =>
        //   setChecked({ checked, isCompleted: !checked.isCompleted })
        // }
        // Use ThemeProvider to make change for all checkbox
        checked={check1}
        onPress={() => setCheck1(!check1)}
        iconType="material-community"
        checkedIcon="checkbox-marked"
        uncheckedIcon="checkbox-blank-outline"
        checkedColor="#4A3780"
        size={32}
      />
    </View>
  );
  return (
    <SafeAreaView className="flex-1 bg-[#F1F5F9]">
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
            data={todosData.filter((todo) => !todo.isCompleted)}
            renderItem={this.renderItem}
          />
        </View>
        <Text className="text-lg font-semibold ml-[5%] my-[5%]">
          Hoàn thành
        </Text>
        <View className="w-[90%] h-32 bg-white rounded-2xl mx-[5%] flex flex-row items-center">
          <FlatList
            data={todosData.filter((todo) => todo.isCompleted)}
            renderItem={this.renderItemCompleted}
          />
        </View>
        <TouchableOpacity className="w-[80%] h-14 ml-[10%] bg-[#3A4666] rounded-2xl mt-6 flex items-center justify-center">
          <Text className="text-white text-center font-bold text-xl">
            Thêm công việc
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ToDoListScreen;
