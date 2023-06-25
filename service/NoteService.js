
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { generateUUID } from "./uid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageUtils from "./StorageUtils";
import DateTimeUtils from "./DateTimeUtils";
import SecurityUtils from "./SecurityUtils";
import { Alert } from "react-native";


class NoteService{

    static async loadSecretPasswordData(){
      const user = auth.currentUser;
      const docRef = doc(firestore, "notelist", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const password = docSnap.data().password;
        if(password != undefined && password != ""){
          return password;
        } 
        return "";
      } else {
        return "";
      }
    }

    static async loadNoteData() {
        const noteList = await AsyncStorage.getItem('noteList');
        if(noteList != null){
          return JSON.parse(noteList);
        }
        
        const user = auth.currentUser;
        const docRef = doc(firestore, "notelist", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          var jsonObject = docSnap.data().notelist;
          jsonObject = await Promise.all(jsonObject.map(item => {
            if(item.isSecret){
              const title = SecurityUtils.decrypt2(item.title, user.uid)._j;
              console.log("title: ", title);
              const note = SecurityUtils.decrypt2(item.note, user.uid)._j;
              console.log("note: ", note);
              return {...item, note: note, title: title}
            } else{
              return item;
            }
          }))
          console.log("jsonObject: ", jsonObject)
          AsyncStorage.setItem('noteList', JSON.stringify(jsonObject));
          return jsonObject;
        } else {
          console.log("No such document!");
          return [];
        }
    }

    static async addNote(title, note, isSecret){
        const user = auth.currentUser;
        const documentId = generateUUID(6);
        const nowDate = DateTimeUtils.getNow();
        var item = {
            id: documentId,
            title: title,
            note: note,
            createdDay: nowDate,
            updatedDay: nowDate,
            isLoved: false,
            isSecret: isSecret
        };
        await StorageUtils.pushElementToArray("noteList", item);
        if(isSecret){
          const eTitle = await SecurityUtils.encrypt2(title, user.uid);
          const eNote = await SecurityUtils.encrypt2(note, user.uid);
          item = {...item, title: eTitle, note: eNote};
        }

        const userRef = doc(collection(firestore, 'notelist'), user.uid);
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()){
            updateDoc(userRef, {notelist: arrayUnion(item)}, {merge: true});
        }else{
            setDoc(userRef, { notelist: [item] });
        }

    }

    static async updateNote(elm) {
        const user = auth.currentUser;
        const nowDate = DateTimeUtils.getNow();
        var updatedData = {
          id: elm.c_id,
          title: elm.title,
          note: elm.note,
          createdDay: elm.createdDay,
          updatedDay: nowDate,
          isLoved: elm.isLoved,
          isSecret: elm.isSecret
        };
        console.log("Update element: ", updatedData);
        await StorageUtils.updateElementInArray('noteList', updatedData);
        if(elm.isSecret){
          const eTitle = await SecurityUtils.encrypt2(elm.title, user.uid);
          const eNote = await SecurityUtils.encrypt2(elm.note, user.uid);
          updatedData = {...updatedData, title: eTitle, note: eNote};
        }

        try {
          const userRef = doc(collection(firestore, "notelist"), user.uid);
          const userDoc = await getDoc(userRef);
          const noteData = userDoc.data().notelist;
          const itemIndex = noteData.findIndex(
            (item) => item.id === elm.c_id
          );
          if (itemIndex !== -1) {
            const updateNoteList = [...noteData];
            updateNoteList[itemIndex] = {
              ...updateNoteList[itemIndex],
              ...updatedData,
            };
            updateDoc(
              userRef,
              { "notelist": updateNoteList },
              { merge: true }
            );
            console.log("update OKK");
          } else {
            console.log("No schedule item found");
          }
        } catch (error) {
          console.log("error: ", error);
        }
    }

    static async deleteNote(id){
        await StorageUtils.removeElementFromArray('noteList', id);
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, 'notelist'), user.uid);
        const userDoc = await getDoc(userRef);
        const noteList = userDoc.data().notelist;
        const updatedNoteList = noteList.filter(item => item.id !== id);
        updateDoc(userRef, { notelist: updatedNoteList }, {merge: true});
        console.log("delete OKK");
    };

    static async deleteNotes(ids){
      await StorageUtils.removeElementsFromArray('noteList', ids);
      const user = auth.currentUser;
      const userRef = doc(collection(firestore, 'notelist'), user.uid);
      const userDoc = await getDoc(userRef);
      const noteList = userDoc.data().notelist;
      const updatedNoteList = noteList.filter(item => !ids.includes(item.id));
      updateDoc(userRef, { notelist: updatedNoteList }, {merge: true});
      console.log("delete OKK");
    };

    static async updateLovedStatus(items){     
      try {
        console.log("updateLovedStatus with: ", items);
        const ids = items.map(item => item.id);
        await StorageUtils.updateLovedElementsInArray('noteList', items); 
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, 'notelist'), user.uid);
        const userDoc = await getDoc(userRef);
        const noteList = userDoc.data().notelist;
        const updatedNoteList = noteList.map(item => {
          var temp;
          if(ids.includes(item.id)){
            return {...item, isLoved: !item.isLoved}
          }else{
            return item;
          }
        });
        updateDoc(userRef, { notelist: updatedNoteList }, {merge: true});
        console.log("update okk");
        } catch (error) {
          console.log("updateLovedStatus: ", error);
        }
    }

    static async updateSecretFolder(items){     
      try {
        console.log("updateSecretFolder");
        const ids = items.map(item => item.id);
        await StorageUtils.updateSecretElementsInArray('noteList', items); 
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, 'notelist'), user.uid);
        const userDoc = await getDoc(userRef);
        const noteList = userDoc.data().notelist;
        const updatedNoteList = await Promise.all(noteList.map(item => {
          if(ids.includes(item.id)){
            var temp = {...item, isSecret: !item.isSecret}
            console.log("temp1: ", temp);
            if(temp.isSecret){
              const eTitle = SecurityUtils.encrypt2(item.title, user.uid)._j;
              const eNote = SecurityUtils.encrypt2(item.note, user.uid)._j;
              temp = {...temp, title: eTitle, note: eNote};
            }else{
              const eTitle = SecurityUtils.decrypt2(item.title, user.uid)._j;
              const eNote = SecurityUtils.decrypt2(item.note, user.uid)._j;
              temp = {...temp, title: eTitle, note: eNote};
            }
            console.log("temp2: ", temp);
            return temp;
          }else{
            return item;
          }

        }));
        console.log("updatedNoteList: ", updatedNoteList);
        updateDoc(userRef, { notelist: updatedNoteList }, {merge: true});
        console.log("update okk");
        } catch (error) {
          console.log("updateSecretFolder: ", error);
        }
    }

    static async saveSecretFolderPassword(password){   
      try {
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, 'notelist'), user.uid);
        const userDoc = await getDoc(userRef); 
        const hashPassword = await SecurityUtils.encrypt(password, user.uid);    
        if(userDoc.exists()){
            updateDoc(userRef, {password: hashPassword}, {merge: true});
        }else{
            setDoc(userRef, { password: hashPassword });
        }
        return hashPassword;
      } catch (error) {
        console.log("saveSecretFolderPassword: ", error);
        return "";
      }
    }  

    static async login(password, encryptPassword){
      const user = auth.currentUser;
      const hashPassword = await SecurityUtils.encrypt(password, user.uid); 
      console.log("user pass: ", hashPassword);
      console.log("encryptPasswoed pass: ", encryptPassword);
      return hashPassword == encryptPassword;
    }

    static async changePassword(oldPass, newPass){
      try {
        const user = auth.currentUser;
        const oldHash = await this.loadSecretPasswordData(); 
        const hashPassword = await SecurityUtils.encrypt(oldPass, user.uid);

        if(oldHash != hashPassword){
          return "";
        }
        const newHashPassword = await this.saveSecretFolderPassword(newPass);
        return newHashPassword;
      } catch (error) {
        console.log("changePassword: ", error);
        return "";
      }
    }

    static async resetPassword(appPass, newPass){
      const currentAppPass = await AsyncStorage.getItem("password");
      if(appPass != currentAppPass){
        return "";
      } 
      return await this.saveSecretFolderPassword(newPass);
    }


}

export default NoteService;