import CalendarService from "./CalendarService";
import TodolistService from "./TodolistService";
import * as Notifications from 'expo-notifications'

import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import CredentialService from "./CredentialService";

class CommonService{

    static async loadAllNotificationAndUpdateDB(){
        try {
            await CalendarService.loadAutoUpdateMoodleBackground(); 
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