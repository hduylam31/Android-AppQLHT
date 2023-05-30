

import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

class AccountService{

    static async loadUserInfo(){
        try {
            const nameCache = await AsyncStorage.getItem("name");
            if(nameCache != null && nameCache != ''){
                return nameCache;
            }
            const user = auth.currentUser;
            const userRef = doc(collection(firestore, 'user'), user.uid);
            const userDoc = await getDoc(userRef);
            if(userDoc.exists()){
                const data = userDoc.data();
                if(data.name){
                    AsyncStorage.setItem("name", data.name);
                    return data.name;
                }
            }
            return "";
        } catch (error) {
            console.log("loadUserInfo: ", error);
            return "";
        }
    }

    static async saveUserInfo(name){
        try {
            await AsyncStorage.setItem("name", name);
            const user = auth.currentUser;
            const userRef = doc(collection(firestore, 'user'), user.uid);
            updateDoc(userRef, {name: name})
            
        } catch (error) {
            console.log("saveUserInfo: ", error);
        }
    }

}

export default AccountService;