

import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { generateUUID } from "./uid";

class TodolistService{
    static addTodolist = async (vtitle, vselectedCategory, isNotified, vtextTime, vcontent) => {
        console.log("inside function");
        const user = auth.currentUser;
        const documentId = generateUUID(6);
        let vTimeNotified;
        if(isNotified){ 
            const timeArray = vtextTime.split(":");
            vTimeNotified = timeArray[0] + ":" + timeArray[1];
        }else{
            vTimeNotified = "";
        }
        console.log("isNotified: ", isNotified);
        console.log("Time: ", vTimeNotified);
        const userRef = doc(collection(firestore, 'todolist'), user.uid);
        const item = {
            id: documentId,
            title: vtitle,
            category: vselectedCategory,
            isNotified: isNotified,
            hour: vTimeNotified,
            text: vcontent,
            isCompleted: false
        };
        try {
            const userDoc = await getDoc(userRef);
            if(userDoc.exists()){
                //update
                updateDoc(userRef, {
                    todolist: arrayUnion(item)}, {merge: true});
               console.log("done update function OKK" );
            }else{
                await setDoc(userRef, { 
                    todolist: [item] 
                });
                console.log("done add function");
            }
        } catch (error) {
            
        }
        
      };


    // static updateTodolist = async (id, title, category, isNotified, hour, text, isCompleted) => {
    //     console.log("Update Todolist");
    //     const user = auth.currentUser;
    //     let vTimeNotified;
    //     if(isNotified){ 
    //         const timeArray = hour.split(":");
    //         vTimeNotified = timeArray[0] + ":" + timeArray[1];
    //     }else{
    //         vTimeNotified = "";
    //     }

    //     const updatedData = {
    //         id: id, title: title, 
    //         category: category, isNotified: isNotified, 
    //         hour: vTimeNotified,text: text,isCompleted: isCompleted
    //     }

    //     const userRef = doc(collection(firestore, 'todolist'), user.uid);
    //     try {
    //         const userDoc = await getDoc(userRef);
    //         const todolist = userDoc.data().todolist;
    //         const updatedTodolist = todolist.map((item) => {
    //             if (item.id === id) {
    //             return { ...item, ...updatedData };
    //             } else {
    //             return item;
    //             }
    //         });
    //         await updateDoc(userRef, { todolist: updatedTodolist });
    //         console.log("update OK");
    //     } catch (error) {
    //         console.log("error: ", error);
    //     }
    // };

    static updateTodolist = async (id, title, category, isNotified, hour, text, isCompleted) => {
        console.log("Update Todolist");
        const user = auth.currentUser;
        let vTimeNotified;
        if(isNotified){ 
            const timeArray = hour.split(":");
            vTimeNotified = timeArray[0] + ":" + timeArray[1];
        }else{
            vTimeNotified = "";
        }

        const updatedData = {
            id: id, title: title, 
            category: category, isNotified: isNotified, 
            hour: vTimeNotified,text: text,isCompleted: isCompleted
        }

        const userRef = doc(collection(firestore, 'todolist'), user.uid);
        try {
            const userDoc = await getDoc(userRef);
            const todolist = userDoc.data().todolist;
            const itemIndex = todolist.findIndex(item => item.id === id);
            if(itemIndex !== -1){
                const updatedTodolist = [...todolist];
                updatedTodolist[itemIndex] = {...updatedTodolist[itemIndex], ...updatedData};
                await updateDoc(userRef, { todolist: updatedTodolist }, {merge: true});
                console.log("update OKK");
            }else{
                console.log("No todolist item found");
            }
            
        } catch (error) {
            console.log("error: ", error);
        }
    };

    static deleteTodolist = async (id) => {
        console.log("Delete Todolist");
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, 'todolist'), user.uid);
        try {
            const userDoc = await getDoc(userRef);
            const todolist = userDoc.data().todolist;
            const updatedTodolist = todolist.filter(item => item.id !== id);
            await updateDoc(userRef, { todolist: updatedTodolist }, {merge: true});
            console.log("delete OKK");
        } catch (error) {
            console.log("error: ", error);
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