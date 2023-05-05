import AsyncStorage from "@react-native-async-storage/async-storage";



class StorageUtils{

    static async pushElementToArray(key, newElement) {
        try {
          const existingArray = await AsyncStorage.getItem(key);
          let newArray = existingArray ? JSON.parse(existingArray) : [];
          newArray.push(newElement);
          await AsyncStorage.setItem(key, JSON.stringify(newArray));
        } catch (error) {
          console.log(error);
        }
    }

    static async removeElementFromArray(key, id) {
        try {
          const existingArray = await AsyncStorage.getItem(key);
          let newArray = existingArray ? JSON.parse(existingArray) : [];
          newArray = newArray.filter(item => item.id !== id);
          await AsyncStorage.setItem(key, JSON.stringify(newArray));
        } catch (error) {
          console.log(error);
        }
    }

    static async updateElementInArray(key, updatedElement) {
        try {
          const existingArray = await AsyncStorage.getItem(key);
          let newArray = existingArray ? JSON.parse(existingArray) : [];
          const index = newArray.findIndex(item => item.id === updatedElement.id);
          if (index !== -1) {
            newArray[index] = { ...newArray[index], ...updatedElement };
            await AsyncStorage.setItem(key, JSON.stringify(newArray));
          }
        } catch (error) {
          console.log(error);
        }
    }
}

export default StorageUtils;