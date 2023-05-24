
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { generateUUID } from "./uid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageUtils from "./StorageUtils";
import DateTimeUtils from "./DateTimeUtils";
import SecurityUtils from "./SecurityUtils";

class NoteService{

    static async loadNoteData() {
        const noteList = await AsyncStorage.getItem('noteList');
        if(noteList != null){
          return JSON.parse(noteList);
        }

        const user = auth.currentUser;
        const docRef = doc(firestore, "notelist", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const jsonObject = docSnap.data().notelist;
          AsyncStorage.setItem('noteList', JSON.stringify(jsonObject));
          return jsonObject;
        } else {
          console.log("No such document!");
          return [];
        }
    }

    static async addNote(title, note){
        const user = auth.currentUser;
        const documentId = generateUUID(6);
        const nowDate = DateTimeUtils.getNow();
        const item = {
            id: documentId,
            title: title,
            note: note,
            createdDay: nowDate,
            updatedDay: nowDate,
            isLoved: false
        };
        await StorageUtils.pushElementToArray("noteList", item);

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
        const updatedData = {
          id: elm.c_id,
          title: elm.title,
          note: elm.note,
          createdDay: elm.createdDay,
          updatedDay: nowDate,
          isLoved: elm.isLoved
        };
        console.log("Update element: ", updatedData);
        await StorageUtils.updateElementInArray('noteList', updatedData);
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
        console.log("updateLovedStatus");
        const ids = items.map(item => item.id);
        await StorageUtils.updateLovedElementsInArray('noteList', items); 
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, 'notelist'), user.uid);
        const userDoc = await getDoc(userRef);
        const noteList = userDoc.data().notelist;
        const updatedNoteList = noteList.map(item => {
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

    static async saveSecretFolderPassword(password){   
      try {
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, 'notelist'), user.uid);
        const userDoc = await getDoc(userRef); 
        const hashPassword = await SecurityUtils.encrypt(password, user.uid);    
        console.log("password: ", password);
        console.log("hashPassword: ", hashPassword); 
        if(userDoc.exists()){
            updateDoc(userRef, {password: hashPassword}, {merge: true});
        }else{
            setDoc(userRef, { password: hashPassword });
        }
      } catch (error) {
        console.log("saveSecretFolderPassword: ", error);
      }
    }
}

export default NoteService;