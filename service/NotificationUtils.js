

import * as Notifications from 'expo-notifications'

class NotificationUtils{

    static async setNotificationAndGetIdentifer(title, content, timeInfo){
        try {
            console.log("Get Identifier with timeInfo: ", timeInfo);
            let identifier = "";
            if(!timeInfo.year){
                identifier = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: title,
                        body: content,
                    },
                    trigger: {
                        hour: timeInfo.hour,
                        minute: timeInfo.minute,
                        repeats: timeInfo.isRepeated
                    }
                })
            }else{
                const scheduledDate  = new Date(timeInfo.year, timeInfo.month -1, timeInfo.day, timeInfo.hour, timeInfo.minute, 0);
                identifier = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: title,
                        body: content,
                    },
                    trigger: scheduledDate,
                })
            }
            
            console.log("Identifier: ", identifier);
            return identifier;
        } catch (error) {
            console.log("Set Notification: ", error);
            return "";
        }
        
    }

    static async cancelNotification(identifier){
        try {
            await Notifications.cancelScheduledNotificationAsync(identifier);
            console.log("remove notification Ok");
            return true;
        } catch (error) {
            console.log("Cancel Notification: ", error);
            return false;
        }
    }

    static async updateNotificationAndGetIdentifer(oldIdentifier, title, content, timeInfo){
        const removedStatus = await this.cancelNotification(oldIdentifier);
        if(removedStatus){
            return await this.setNotificationAndGetIdentifer(title, content, timeInfo);
        }else{
            return null;
        }
    }

    static async removeAllNotification(){
        try {
            Notifications.cancelAllScheduledNotificationsAsync();
            console.log("Remove All Notification Ok");
        } catch (error) {
            console.log("Remove All Notification Fail");
        }
    }

}

export default NotificationUtils;