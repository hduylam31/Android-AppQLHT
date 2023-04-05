

import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { generateUUID } from "./uid";
import NotificationUtils from "./NotificationUtils";

class TodolistService{
    static addTodolist = async (vtitle, vselectedCategory, isNotified, vtextTime, vcontent) => {
        try {
            console.log("inside functionnnnnnnn");
            const user = auth.currentUser;
            const documentId = generateUUID(6);
            let vTimeNotified;
            let identifier = "";
            /* ==================================Notification====================================== */
            if(isNotified){ 
                const timeArray = vtextTime.split(":");
                vTimeNotified = timeArray[0] + ":" + timeArray[1];
                const timeInfo = {
                    hour: Number(timeArray[0]),
                    minute: Number(timeArray[1]),
                    isRepeated: true
                }
                identifier = await NotificationUtils.setNotificationAndGetIdentifer(vtitle, vcontent, timeInfo);
            }else{
                vTimeNotified = "";
            }

            const item = {
                id: documentId,
                title: vtitle,
                category: vselectedCategory,
                isNotified: isNotified,
                hour: vTimeNotified,
                text: vcontent,
                isCompleted: false,
                identifier: identifier
            };
            console.log("identifier Ok");

            /* ==================================DB Adding====================================== */
            const userRef = doc(collection(firestore, 'todolist'), user.uid);
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
            console.log("add todolist: ", error);
        }
        
      };

    static updateTodolist = async (newItem, oldItem) => {
        console.log("Update Todolist");
        const user = auth.currentUser;
        let vTimeNotified;
        let identifier = "";

        if(newItem.isNotified){ 
            const timeArray = newItem.hour.split(":");
            vTimeNotified = timeArray[0] + ":" + timeArray[1];
        }else{
            vTimeNotified = "";
        }

        // ==================================Notification============================
        if(oldItem.isNotified && !newItem.isNotified && !oldItem.isCompleted){ // Chỉ xóa thông báo khi cập nhật Thông báo -> Không thông páo
            NotificationUtils.cancelNotification(oldItem.identifier);
        }else if(!oldItem.isCompleted){ // Còn những trường hợp còn lại chưa hoàn thành todolist thì set thông báo mới (chỉ có category ko impact) 
            const timeArray = newItem.hour.split(":");
            const timeInfo = {
                hour: Number(timeArray[0]),
                minute: Number(timeArray[1]),
                isRepeated: true
            }
            identifier = await NotificationUtils.setNotificationAndGetIdentifer(newItem.title, newItem.text, timeInfo);
        }
        // =====================================DB===================================

        const updatedData = {
            id: newItem.id, title: newItem.title, 
            category: newItem.category, isNotified: newItem.isNotified, 
            hour: vTimeNotified,text: newItem.text,isCompleted: newItem.isCompleted,
            identifier: identifier
        }

        const userRef = doc(collection(firestore, 'todolist'), user.uid);
        try {
            const userDoc = await getDoc(userRef);
            const todolist = userDoc.data().todolist;
            const itemIndex = todolist.findIndex(item => item.id === newItem.id);
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

    static deleteTodolist = async (c_item) => {
        console.log("Delete Todolist");
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, 'todolist'), user.uid);
        try {
            // ==================================Notification============================
            if(c_item.isNotified && !c_item.isCompleted){
                NotificationUtils.cancelNotification(c_item.identifier);
            }
            // =====================================DB===================================
            const userDoc = await getDoc(userRef);
            const todolist = userDoc.data().todolist;
            const updatedTodolist = todolist.filter(item => item.id !== c_item.id);
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

    static updateCompletedStatus = async(c_item) => {
        try {
            console.log("inside update status function");
            // ==================================Notification============================ 
            let identifier = "";
            if(!c_item.isCompleted){//Hoàn thành task => xóa thông báo
                if(c_item.isNotified){
                    NotificationUtils.cancelNotification(c_item.identifier);
                }
            }else{  // chuyển lại chưa hoành thành => Thêm thông báo nếu đang bật
                if(c_item.isNotified){
                    const timeArray = c_item.hour.split(":");
                    const timeInfo = {
                        hour: Number(timeArray[0]),
                        minute: Number(timeArray[1]),
                        isRepeated: true
                    }
                    identifier = await NotificationUtils.setNotificationAndGetIdentifer(c_item.title, c_item.text, timeInfo);
                }
            }
            console.log("Update identifier Ok");
            // =====================================DB===================================
            const user = auth.currentUser;
            const userRef = doc(collection(firestore, 'todolist'), user.uid);
            const userDoc = await getDoc(userRef);
            const todolist = userDoc.data().todolist;
            const updatedTodolist = todolist.map((item) => {
                if (item.id === c_item.id) {
                    return { ...item, isCompleted: !item.isCompleted, identifier: identifier };
                } else {
                    return item;
                }
            });
            await updateDoc(userRef, { todolist: updatedTodolist });
            console.log("Update status Ok");
        } catch (error) {
            console.log("update completed status: ", error);
        }
        
    }
}

export default TodolistService;