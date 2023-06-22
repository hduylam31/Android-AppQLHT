
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { generateUUID } from "./uid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StorageUtils from "./StorageUtils";

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
        const item = {
            id: documentId,
            title: title,
            note: note
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
        const updatedData = {
          id: elm.c_id,
          title: elm.title,
          note: elm.note
        };
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
}

export default NoteService;