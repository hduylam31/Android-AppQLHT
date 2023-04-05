

import * as Notifications from 'expo-notifications'

class NotificationUtils{

    static async setNotificationAndGetIdentifer(title, content, timeInfo){
        try {
            console.log("Get Identifier");
            const identifier = await Notifications.scheduleNotificationAsync({
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

}

export default NotificationUtils;