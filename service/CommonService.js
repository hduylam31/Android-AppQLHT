import CalendarService from "./CalendarService";
import TodolistService from "./TodolistService";

class CommonService{

    static async loadAllNotificationAndUpdateDB(){
        try {
            console.log("Load notification"); 
            await CalendarService.loadNotificationAndUpdateDb(); 
            await TodolistService.loadNotificationAndUpdateDb(); 
            console.log("Load notification Ok");
        } catch (error) {
            console.log("loadAllNotificationAndUpdateDB: ", error);
        }
        
    } 
}

export default CommonService; 