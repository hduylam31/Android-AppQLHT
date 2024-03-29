import {
  Image,
  StyleSheet,
  FlatList,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Manual_I,
  Manual_II,
  Manual_III,
  Manual_IV,
  Manual_V,
  Manual_VI,
  Manual_VII,
  Manual_VIII,
} from "../../assets";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

const { width, height } = Dimensions.get("window");

const COLORS = { primary: "#23ACCD", white: "#fff" };

const slides = [
  {
    id: "1",
    image: Manual_I,
  },
  {
    id: "2",
    image: Manual_II,
  },
  {
    id: "3",
    image: Manual_III,
  },
  {
    id: "4",
    image: Manual_IV,
  },
  {
    id: "5",
    image: Manual_V,
  },
  {
    id: "6",
    image: Manual_VI,
  },
  {
    id: "7",
    image: Manual_VII,
  },
  {
    id: "8",
    image: Manual_VIII,
  },
];

const Slide = ({ item }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <Image source={item?.image} style={{ height: "87%", width }} />
    </View>
  );
};

const UserManual_I = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = React.useRef();
  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({ offset });
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current.scrollToOffset({ offset });
    setCurrentSlideIndex(lastSlideIndex);
  };
  const route = useRoute();
  const [isOpen, setIsOpen] = useState(false);
  const { param1 } = route.params;
  useEffect(() => {
    if (param1 === "isOpen") {
      setIsOpen(true);
      console.log("isOpen", isOpen);
    }
  }, [route]);

  const Footer = () => {
    return (
      <View
        style={{
          height: height * 0.13,
          justifyContent: "space-between",
          paddingHorizontal: 10,
        }}
      >
        {/* Indicator container */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          {/* Render indicator */}
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: COLORS.white,
                  width: 25,
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={{ marginBottom: 20 }}>
          {currentSlideIndex == slides.length - 1 ? (
            <View style={{ height: 42 }}>
              {/* Press bắt đầu ở đây */}
              {isOpen && (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    navigation.navigate("Tài khoản");
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    Xác nhận
                  </Text>
                </TouchableOpacity>
              )}
              {!isOpen && (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    navigation.navigate("Login");
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    Bắt đầu
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  {
                    borderColor: COLORS.white,
                    borderWidth: 1,
                    backgroundColor: "transparent",
                  },
                ]}
                onPress={skip}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: COLORS.white,
                  }}
                >
                  Bỏ qua
                </Text>
              </TouchableOpacity>
              <View style={{ width: 15 }} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={styles.btn}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  Tiếp theo
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      {/* <View style={{ flex: 1, backgroundColor: COLORS.primary }}> */}
      {/* <StatusBar backgroundColor={COLORS.primary} /> */}
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{ height: height }}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({ item }) => <Slide item={item} />}
      />
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  indicator: {
    height: 2.5,
    width: 10,
    backgroundColor: "#FE8668",
    marginHorizontal: 3,
    borderRadius: 2,
  },
  btn: {
    flex: 1,
    height: 42,
    borderRadius: 5,
    backgroundColor: "#FE8668",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserManual_I;
