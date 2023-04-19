import CalendarService from "./CalendarService";
import TodolistService from "./TodolistService";
import * as Notifications from 'expo-notifications'

import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import CredentialService from "./CredentialService";
import NotificationUtils from "./NotificationUtils";

class CommonService{

    static async loadAllNotificationAndUpdateDB(isAutoLogin){
        try {
            await NotificationUtils.removeAllNotification();
            await CalendarService.loadAutoUpdateMoodleBackground(isAutoLogin); 
            console.log("Load background running OK");
            await CalendarService.loadNotificationAndUpdateDb(); 
            TodolistService.loadNotificationAndUpdateDb(); 
            console.log("Load notification Ok"); 
        } catch (error) {
            console.log("loadAllNotificationAndUpdateDB: ", error);
        }
    } 
}

export default CommonService; 