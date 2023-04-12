import * as Notifications from 'expo-notifications'

import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import CredentialService from "./CredentialService";


class AutoUpdateService{

    static async registerAutoUpdateMoodleBackgroundTask(){
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Cập nhật moodle',
                body: 'Đã thiết lập cơ chế tự động cập nhật',
                data: { autoUpdate: true }, // Add custom data to identify the notification
            },
            trigger: {
                hour: 6,
                repeats: true
            },
        });
        console.log("Task is scheduled with: ", identifier);
        return identifier;
    }
}

export default AutoUpdateService;