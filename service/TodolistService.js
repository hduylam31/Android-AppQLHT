


import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { generateUUID } from "./uid";

class TodolistService{
    static addTodolist = async (vtitle, vselectedCategory, vtextDate, vtextTime, vcontent) => {
        console.log("inside function");
        const user = auth.currentUser;
        const documentId = generateUUID(6);
        const timeArray = vtextTime.split(":");
        const hourAndmin = timeArray[0] + ":" + timeArray[1];
        const userRef = doc(collection(firestore, 'todolist'), user.uid);
        try {
            const userDoc = await getDoc(userRef);
            if(userDoc.exists()){
                //update
                updateDoc(userRef, {
                    todolist: arrayUnion({
                       id: documentId,
                       title: vtitle,
                       category: vselectedCategory,
                       date: vtextDate,
                       hour: hourAndmin,
                       text: vcontent,
                       isCompleted: false
                   })
               });
               console.log("done update function");
            }else{
                await setDoc(userRef, { 
                    todolist: [{
                        id: documentId,
                        title: vtitle,
                        category: vselectedCategory,
                        date: vtextDate,
                        hour: hourAndmin,
                        text: vcontent,
                        isCompleted: false
                    }] 
                });
                console.log("done add function");
            }
        } catch (error) {
            
        }
        
      };

    static loadTodolist = async() => {
        const user = auth.currentUser;
        console.log("inside load todolist function");
        const docRef = doc(firestore, "todolist", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const jsonObject = docSnap.data();
            const todolists = jsonObject.todolist;
            console.log("todolist:", todolists);
            return todolists;
          } else {
            console.log("No such document!");
            return [];
          }
    }

    static updateCompletedStatus = async(itemId) => {
        console.log("inside update status function");
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, 'todolist'), user.uid);
        const userDoc = await getDoc(userRef);
        const todolist = userDoc.data().todolist;
        const updatedTodolist = todolist.map((item) => {
            if (item.id === itemId) {
            return { ...item, isCompleted: !item.isCompleted };
            } else {
            return item;
            }
        });
        await updateDoc(userRef, { todolist: updatedTodolist });
    }
}

export default TodolistService;