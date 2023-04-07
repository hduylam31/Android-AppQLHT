import CalendarService from "./CalendarService";
import TodolistService from "./TodolistService";

class CommonService{

    static async loadAllNotificationAndUpdateDB(){
        console.log("hello"); 
        await CalendarService.loadNotificationAndUpdateDb(); 
        await TodolistService.loadNotificationAndUpdateDb(); 
    } 
}

export default CommonService; 