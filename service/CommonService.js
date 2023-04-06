import TodolistService from "./TodolistService";

class CommonService{

    static async loadAllNotificationAndUpdateDB(){
        console.log("hello"); 
        TodolistService.loadNotificationAndUpdateDb(); 
    } 
}

export default CommonService; 