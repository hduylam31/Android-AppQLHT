

import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { generateUUID } from "./uid";
import NotificationUtils from "./NotificationUtils";
import StorageUtils from "./StorageUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native-web";

class TodolistService{
    static addTodolist = async (vtitle, vselectedCategory, isNotified, vtextTime, vcontent, groupName) => {
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
                identifier: identifier,
                groupName: groupName
            };
            await StorageUtils.pushElementToArray("todoList", item);

            /* ==================================DB Adding====================================== */
            const userRef = doc(collection(firestore, 'todolist'), user.uid);
            const userDoc = await getDoc(userRef);
            if(userDoc.exists()){
                //update
                await updateDoc(userRef, {
                    todolist: arrayUnion(item)}, {merge: true});
               console.log("done update function OKK" );
            }else{
                await setDoc(userRef, { 
                    todolist: [item], group: [{name: groupName, isUsing: true}]
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
            NotificationUtils.cancelNotification(oldItem.identifier);
            
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
            identifier: identifier, groupName: newItem.groupName
        }
        await StorageUtils.updateElementInArray('todoList', updatedData);

        const userRef = doc(collection(firestore, 'todolist'), user.uid);
        try {
            const userDoc = await getDoc(userRef);
            const todolist = userDoc.data().todolist;
            const itemIndex = todolist.findIndex(item => item.id === newItem.id);
            if(itemIndex !== -1){
                const updatedTodolist = [...todolist];
                updatedTodolist[itemIndex] = {...updatedTodolist[itemIndex], ...updatedData};
                updateDoc(userRef, { todolist: updatedTodolist }, {merge: true});
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
        await StorageUtils.removeElementFromArray('todoList', c_item.id);
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
            updateDoc(userRef, { todolist: updatedTodolist }, {merge: true});
            console.log("delete OKK");
        } catch (error) {
            console.log("error: ", error);
        }
    };

    static deleteTodolistFromIds = async(items)=> {
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, 'todolist'), user.uid);
        var ids = items.map(item => item.id);
        try {
            // ==================================Notification============================
            Promise.all(items.forEach(item => {
                            if(item.isNotified && !item.isCompleted){
                                NotificationUtils.cancelNotification(item.identifier);
                            }
            }))
            // =====================================DB===================================
            const userDoc = await getDoc(userRef);
            const todolist = userDoc.data().todolist;
            const updatedTodolist = todolist.filter(item => ids.includes(item.id));
            updateDoc(userRef, { todolist: updatedTodolist }, {merge: true});
            console.log("delete OKK");
        } catch (error) {
            console.log("error: ", error);
        }
    }

    static moveToOtherGroup = async(item, newGroupName) => {
        const newItem = {...item, groupName: newGroupName}
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, 'todolist'), user.uid);
        try {
            // ==================================Notification============================
            if(newItem.isNotified && !newItem.isCompleted){
                NotificationUtils.cancelNotification(newItem.identifier);
            }
            // =====================================DB===================================
            const userDoc = await getDoc(userRef);
            const todolist = userDoc.data().todolist;
            const updatedTodolist = todolist.map(item => {
                if(item.id == newItem.id){
                    return newItem;
                }else{
                    return item;
                }
            });
            await updateDoc(userRef, { todolist: updatedTodolist }, {merge: true});
        } catch (error) {
            console.log("error: ", error);
        }

    }

    static deleteGroup = async(groupName) => {
        const user = auth.currentUser;
        const userRef = doc(firestore, "todolist", user.uid);
        if (docSnap.exists()) {
            const userDoc = await getDoc(userRef);
            const todolist = userDoc.data().todolist;
            const group = userDoc.data().group;
            
            const newTodolist = todolist.filter(item => item.groupName != groupName)
            const newGroup = group.filter(item => item.name != groupName)
            await updateDoc(userRef, { group: newGroup, todolist: newTodolist }, {merge: true}); 
        }
    } 

    static loadTodolist = async() => {
        const user = auth.currentUser;
        console.log("inside load todolist function");
        const docRef = doc(firestore, "todolist", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const jsonObject = docSnap.data();
            const todolists = jsonObject.todolist;
            const groups = jsonObject.group;
            const usingGroup = groups.filter(item => item.isUsing == true);
            const usingGroupName = usingGroup[0].name;
            const usingTodolists = todolists.filter(item => item.groupName == usingGroupName);
            console.log({usingTodolists, usingGroupName});
            return {usingTodolists, usingGroupName} ;
          } else {
            console.log("No such document!");
            return null;
          }
    }

    static loadGroupNames = async() => {
        const user = auth.currentUser;
        const docRef = doc(firestore, "todolist", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const groups = docSnap.data().group; 
            if(groups == undefined){
                return [{title: "Mặc định", key: 1}];
            }
            const groupNames = groups.map((item, index) => ({title: item.name, key: index + 1}));
            return groupNames ;
        } else {
            console.log("No such document!");
            return [{title: "Mặc định", key: 1}];
        }
    }

    static saveGroupName = async(groupName) => {
        try {
            const item = {
                name: groupName,
                isUsing: false
            }
            const user = auth.currentUser;
            const userRef = doc(firestore, "todolist", user.uid);
            const userDoc = await getDoc(userRef);
            if(userDoc.exists()){
                //update
                const groups = userDoc.data().group;
                if(groups.length > 0){
                    if(groups.some(item => item.name == groupName)){
                        alert("Tên nhóm đã tồn tại");
                        return;
                    }
                    await updateDoc(userRef, {group: arrayUnion(item)}, {merge: true});
                }else{
                    await updateDoc(userRef, {group: [item, {name: "Mặc định", isUsing: true}]}, {merge: true});
                }
                
            }else{
                await setDoc(userRef, { 
                    todolist: [], group: [item, {name: "Mặc định", isUsing: true}]
                });
                console.log("done add function");
            }

        } catch (error) {
            console.log("saveGroupName: ", error);
        }
    }

    static changeUsingGroup = async(usingGroupName) => {
        try {
            const user = auth.currentUser;
            const userRef = doc(firestore, "todolist", user.uid);
            const userDoc = await getDoc(userRef);
            if(userDoc.exists()){
                var data = userDoc.data().group;
                const newArray = data.map(item => item.name === usingGroupName ? {...item, isUsing: true} : {...item, isUsing: false});
                console.log("changeUsingGroup: ", newArray);
                await updateDoc(userRef, {group: newArray}, {merge: true});

                var todolists = userDoc.data.todolist;
                var todolistGroup = todolists.filter(item => item.groupName == usingGroupName);
                this.unRegisterNotification(todolistGroup);
            }
        } catch (error) {
            console.log("saveGroupName: ", error);
        }
    }

    static unRegisterNotification = (todolists) => {
        todolists.forEach(item => {
            if(item.isNotified && item.identifier != ""){
                NotificationUtils.cancelNotification(item.identifier);
            }
        })
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
            await AsyncStorage.setItem('todoList', JSON.stringify(updatedTodolist));
            updateDoc(userRef, { todolist: updatedTodolist });
            console.log("Update status Ok");
        } catch (error) {
            console.log("update completed status: ", error);
        }
        
    }

    static async loadNotificationAndUpdateDb(){
        try {
            const usingTodolistInfo = await this.loadTodolist();
            if(usingTodolistInfo == null) return;
            const todolist = usingTodolistInfo.usingTodolists;
            const updatedTodolist = [...todolist];
            const itemIndexes = todolist.filter(item => item.identifier != "" && item.isCompleted == false)
                                        .map(item => todolist.findIndex(obj => obj.id == item.id));
            for(const i of itemIndexes) {
                const elem = todolist[i];
                const timeArray = elem.hour.split(":");
                const timeInfo = {
                    hour: Number(timeArray[0]),
                    minute: Number(timeArray[1]),
                    isRepeated: true
                }
                const identifier = await NotificationUtils.setNotificationAndGetIdentifer(elem.title, elem.text, timeInfo);
                updatedTodolist[i] = {...updatedTodolist[i], identifier: identifier};
            };
            await AsyncStorage.setItem('todoList', JSON.stringify(updatedTodolist)); 
            updateDoc(userRef, { todolist: updatedTodolist }, {merge: true});
            
        } catch (error) {
            console.log("error: ", error);
        }
    }
}

export default TodolistService;