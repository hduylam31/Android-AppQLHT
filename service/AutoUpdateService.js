import * as Notifications from 'expo-notifications'


class AutoUpdateService{

    static async registerAutoUpdateMoodleBackgroundTask(){ 
        //Noti 
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Triviti',
                body: 'Bạn ơi 🥳 Mở app cập nhật moodle nhé 🤓',
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