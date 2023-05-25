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

    static async removeElementsFromArray(key, ids) {
      try {
        const existingArray = await AsyncStorage.getItem(key);
        let newArray = existingArray ? JSON.parse(existingArray) : [];
    
        // Lọc các phần tử có id không nằm trong mảng ids
        newArray = newArray.filter(item => !ids.includes(item.id));
    
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

    static async updateLovedElementsInArray(key, updatedElements) {
      try {
        const existingArray = await AsyncStorage.getItem(key);
        let newArray = existingArray ? JSON.parse(existingArray) : [];
    
        updatedElements.forEach(updatedElement => {
          const index = newArray.findIndex(item => item.id === updatedElement.id);
          if (index !== -1) {
            newArray[index] = { ...newArray[index], isLoved: !updatedElement.isLoved };
          }
        });
        console.log("new: ", newArray);
        await AsyncStorage.setItem(key, JSON.stringify(newArray));
      } catch (error) {
        console.log(error);
      }
    }

    static async updateSecretElementsInArray(key, updatedElements) {
      try {
        const existingArray = await AsyncStorage.getItem(key);
        let newArray = existingArray ? JSON.parse(existingArray) : [];
    
        updatedElements.forEach(updatedElement => {
          const index = newArray.findIndex(item => item.id === updatedElement.id);
          if (index !== -1) {
            newArray[index] = { ...newArray[index], isSecret: !updatedElement.isSecret };
          }
        });
        console.log("new: ", newArray);
        await AsyncStorage.setItem(key, JSON.stringify(newArray));
      } catch (error) {
        console.log(error);
      }
    }
}

export default StorageUtils;