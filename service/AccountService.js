

import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";

class AccountService{

    static async loadUserInfo(){
        try {
            const user = auth.currentUser;
            const userRef = doc(collection(firestore, 'user'), user.uid);
            const userDoc = await getDoc(userRef);
            if(userDoc.exists()){
                const data = userDoc.data();
                if(data.name){
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
            const user = auth.currentUser;
            const userRef = doc(collection(firestore, 'user'), user.uid);
            const userDoc = await getDoc(userRef);
            if(userDoc.exists()){
                await updateDoc(userRef, {name: name})
            }
        } catch (error) {
            console.log("saveUserInfo: ", error);
        }
    }

}

export default AccountService;