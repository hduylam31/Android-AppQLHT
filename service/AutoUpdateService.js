import * as Notifications from 'expo-notifications'
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import Constants from '../domain/constant';
import CredentialService from './CredentialService';
import CalendarService from './CalendarService';


class AutoUpdateService{
    
    static async registerAutoUpdateMoodleBackgroundTask(){  
        console.log("Register Background Task");
        try {
            await BackgroundFetch.registerTaskAsync(Constants.BACKGROUND_FETCH_TASK, {
                minimumInterval: 21600, // 6 hour
                stopOnTerminate: false, // android only,
                startOnBoot: true, // android only
            });
        } catch (error) {
            console.log("registerAutoUpdateMoodleBackgroundTask", error);
        }
    }

    static async registerAutoRemindBackgroundTask(){ 
        //Noti 
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Triviti',
                body: '🥳 Triviti nhớ bạn 🤓',
                data: { autoUpdate: true }, // Add custom data to identify the notification
            },
            trigger: {
                seconds: 259200, // 3 ngày
                repeats: true
            },
        });
        console.log("Task is scheduled with: ", identifier);
        return identifier;
    }

}

export default AutoUpdateService;