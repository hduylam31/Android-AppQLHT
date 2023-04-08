
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { generateUUID } from "./uid";

class NoteService{

    static async loadNoteData() {
        const user = auth.currentUser;
        const docRef = doc(firestore, "notelist", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const jsonObject = docSnap.data().notelist;
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
        const userRef = doc(collection(firestore, 'notelist'), user.uid);
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()){
            await updateDoc(userRef, {notelist: arrayUnion(item)}, {merge: true});
        }else{
            await setDoc(userRef, { notelist: [item] });
        }
    }

    static async updateNote(elm) {
        const user = auth.currentUser;
        const updatedData = {
          id: elm.c_id,
          title: elm.title,
          note: elm.note
        };
        console.log(updatedData);
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
            await updateDoc(
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
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, 'notelist'), user.uid);
        const userDoc = await getDoc(userRef);
        const noteList = userDoc.data().notelist;
        const updatedNoteList = noteList.filter(item => item.id !== id);
        await updateDoc(userRef, { notelist: updatedNoteList }, {merge: true});
        console.log("delete OKK");
    };
}

export default NoteService;