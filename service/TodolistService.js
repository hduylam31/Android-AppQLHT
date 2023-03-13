


import { collection, doc, setDoc, updateDoc} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { generateUUID } from "./uid";

class TodolistService{
    static addTodolist = (vtitle, vselectedCategory, vtextDate, vtextTime, vcontent) => {
        console.log("inside function");
        const user = auth.currentUser;
        const documentId = generateUUID(6);
        const userRef = doc(collection(firestore, 'todolist'), user.uid);
        updateDoc(userRef, {
            [documentId] : {
                title: vtitle,
                category: vselectedCategory,
                date: vtextDate,
                hour: vtextTime,
                text: vcontent,
                isCompleted: false
            }
        });
        console.log("done update function");
      };
}

export default TodolistService;