import { generateUUID } from "./uid";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  FieldValue,
} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import moment from "moment";
import NotificationUtils from "./NotificationUtils";
import AutoUpdateService from "./AutoUpdateService";
import CredentialService from "./CredentialService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as he from 'he';
import * as BackgroundFetch from 'expo-background-fetch';
import Constants from "../domain/Constants";
import StorageUtils from "./StorageUtils";

class CalendarService {
  static async isMoodleActive() {
    try {
      const moodleStatusStorage = await AsyncStorage.getItem('moodleStatus');
      if(moodleStatusStorage != null){
        return parseInt(moodleStatusStorage);
      }

      const user = auth.currentUser;
      const userRef = doc(collection(firestore, "user"), user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const moodleStatus = userDoc.data().moodle.status;
        if (moodleStatus) {
          AsyncStorage.setItem('moodleStatus', moodleStatus.toString());
          return moodleStatus;
        } else {
          return 0;
        }
      }
    } catch (error) {
      return 0;
    }
  }

  static async getMoodleToken(username, password) {
    console.log("get token");
    url =
      "https://courses.fit.hcmus.edu.vn/login/token.php?username=" +
      encodeURIComponent(username) + 
      "&password=" +
      encodeURIComponent(password) +
      "&service=moodle_mobile_app";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.errorcode === "invalidlogin" || !data.token) {
      return "error";
    }
    AsyncStorage.setItem('moodleToken', data.token);
    return data.token;
  }

  static async processLoginMoodle(username, password) { 
    try {
      const moodleToken = await this.getMoodleToken(username, password); 
      if (moodleToken !== "error") {
        console.log("Login moodle OK with token: ", moodleToken);
        //save token to user colection
        await AsyncStorage.setItem('moodleStatus', '1');
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, "user"), user.uid);
        updateDoc(userRef, { moodle: { token: moodleToken, status: 1 } });
        //load calendar moodle data
        await this.saveCalendarData(moodleToken);
        //Auto update Background 
        await AutoUpdateService.registerAutoUpdateMoodleBackgroundTask();  
        return 1;
      } else {
        alert("Sai thông tin đăng nhập!");
        return 0;
      }
    } catch (error) {
      console.log(error);
      alert("Lỗi");
      return -1;
    }
  }

  //Hàm reload moodle với token
  static async reloadMoodleCalendar() {
    console.log("inside reloadMoodleCalendar function");

    const moodleStatus = await AsyncStorage.getItem('moodleStatus');
    if(moodleStatus != null && parseInt(moodleStatus) == 1){
      const moodleToken = await AsyncStorage.getItem('moodleToken');
      if(moodleToken != null){
        await this.saveCalendarData(moodleToken);
        console.log("save saveCalendarData done");
        return;
      }
    }
    
    try {
      const user = auth.currentUser;
      const userRef = doc(collection(firestore, "user"), user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const moodle = userDoc.data().moodle;
        const status = moodle.status;
        AsyncStorage.setItem('moodleStatus', status.toString());
        if (status === 1) {
          const token = moodle.token;
          AsyncStorage.setItem('moodleToken', token);
          await this.saveCalendarData(token);
          console.log("save saveCalendarData done");
        }
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static async unRegisterMoodleNotification() {
    const user = auth.currentUser;
    const userRef = doc(collection(firestore, "calendar"), user.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const moodleData = userDoc.data().calendar.moodle;
      if(!moodleData) return;
      console.log("unRegisterMoodleNotification......");
      const identifiers = [];
      moodleData.forEach((item) => {
        if (item.identifier != "") {
          identifiers.push(item.identifier);
        }
      });
      if (identifiers.length > 0) {
        await Promise.all(
          identifiers.map((item) => NotificationUtils.cancelNotification(item))
        );
      }
    }
  }

  static async logOutMoodle(status) {
    try {
      await AsyncStorage.removeItem("moodleCalendar");
      await AsyncStorage.removeItem("moodleToken");
      const user = auth.currentUser;
      const userRef = doc(collection(firestore, "user"), user.uid);
      //Xóa token + cập nhật status moodle token
      //Xóa Background chạy nền cập nhật 
      BackgroundFetch.unregisterTaskAsync(Constants.BACKGROUND_FETCH_TASK);
      AsyncStorage.setItem('moodleStatus', status.toString());
      updateDoc(userRef, { "moodle.status": status , "moodle.token": ""});
      //Xóa tất cả dữ liệu thông báo + moodle
      const calendarRef = doc(collection(firestore, "calendar"), user.uid);
      this.unRegisterMoodleNotification();
      updateDoc(calendarRef, { "calendar.moodle": [] });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async saveCalendarData(token) {
    console.log("inside saveCalendarData function");
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    let currentMonthEvent = await this.fetchCalendarData(token, currentMonth, currentYear);
    if (currentMonthEvent === "error") {
      console.log("error token");
      await this.logOutMoodle(-1);
      return;
    }

    let nextMonthEvent = await this.fetchCalendarData(token, nextMonth, nextMonthYear);
    const twoMonthEvents = currentMonthEvent.concat(nextMonthEvent);  
    // =====================================DB===================================
    await AsyncStorage.setItem('moodleCalendar', JSON.stringify(twoMonthEvents)); 

    const user = auth.currentUser;
    const userRef = doc(collection(firestore, "calendar"), user.uid);
    
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      updateDoc(userRef, { "calendar.moodle": twoMonthEvents });
    } else {
      setDoc(userRef, { calendar: { moodle: twoMonthEvents } });
    }

    console.log("done save two month calendar function OKK");
  }

  static async fetchCalendarData(token, month, year) {
    console.log("get calendar data");
    url =
      "https://courses.fit.hcmus.edu.vn/webservice/rest/server.php?wstoken=" +
      token +
      "&wsfunction=core_calendar_get_calendar_monthly_view&moodlewsrestformat=json&year=" +
      year +
      "&month=" +
      month;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.errorcode === "invalidtoken") {
      return "error";
    }
    const events = [];
    const promises = []; // create an array to store promises
    data.weeks.forEach((week) => {
      week.days.forEach((day) => {
        day.events.forEach(async (event) => {
          const coureName = he.decode(event.course.fullname);
          const eventName = he.decode(event.name);
          const timestamp = event.timestart;
          const date = new Date(timestamp * 1000);
          const dateString = date
            .toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .split("/")
            .reverse()
            .join("-");
          const timeString = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h24",
          });
          const id = generateUUID(6);
          // ==================================Notification============================
          //Thông báo cách tối thiểu 2h
          const [year, month, day] = dateString.split("-");
          const timeArray = timeString.split(":");
          const deadlineDate = new Date(
            year,
            month - 1,
            day,
            timeArray[0],
            timeArray[1]
          );
          const now = new Date(Date.now());
          // const now = new Date(2022,12-1, 1,0,0); //test 01/12/2022 do dữ liệu đang tháng 11 và 12/2022
          const diff = deadlineDate - now;
          const threeDays = 60 * 1000 * 60 * 24 * 3;
          const twoHours = 2 * 60 * 60 * 1000;
          let identifier = "";
          if (diff > 0 && diff <= threeDays) {
            //chỉ lấy dữ liệu trong 2 ngày tiếp theo (test thì lấy 30 ngày)
            const twoHoursBeforeDeadlineTime = new Date(
              deadlineDate.getTime() - twoHours
            );
            const timeInfo = {
              year: Number(twoHoursBeforeDeadlineTime.getFullYear()),
              month: Number(twoHoursBeforeDeadlineTime.getMonth() + 1),
              day: Number(twoHoursBeforeDeadlineTime.getDate()),
              hour: Number(twoHoursBeforeDeadlineTime.getHours()),
              minute: Number(twoHoursBeforeDeadlineTime.getMinutes()),
            };
            promises.push(
              NotificationUtils.setNotificationAndGetIdentifer(
                coureName,
                eventName,
                timeInfo
              ).then((res) => {
                identifier = res;
              })
            );
          }
          // ==================================End Notification============================

          const eventItemPromise = Promise.all(promises).then(() => {
            const eventItem = {
              id: id,
              title: eventName,
              description: coureName,
              isMoodle: "true",
              isNotified: true,
              dateString: dateString,
              timeString: timeString,
              identifier: identifier,
            };
            events.push(eventItem);
          });
          promises.push(eventItemPromise);
        });
      });
    });
    return Promise.all(promises).then(() => {
      return events;
    });
  }

  static async loadCalendarData() {
    console.log("inside load calendar function");
    
    const moodleCalendar = await AsyncStorage.getItem('moodleCalendar');
    const userCalendar = await AsyncStorage.getItem('userCalendar');
    if(moodleCalendar != null || userCalendar != null){
      let storageResult = [];
      if(moodleCalendar != null){
        storageResult = storageResult.concat(JSON.parse(moodleCalendar));
      }
      
      if(userCalendar != null){
        storageResult = storageResult.concat(JSON.parse(userCalendar));
      }
      return storageResult;
    }


    const user = auth.currentUser;
    const docRef = doc(firestore, "calendar", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const jsonObject = docSnap.data().calendar;
      let result = [];
      const moodleCalendars = jsonObject.moodle;
      if (moodleCalendars && moodleCalendars.length > 0) {
        AsyncStorage.setItem('moodleCalendar', JSON.stringify(moodleCalendars));
        result = result.concat(moodleCalendars);
      }else{
        AsyncStorage.setItem('moodleCalendar', JSON.stringify([]));
      }
      const userCalendars = jsonObject.user;
      if (userCalendars && userCalendars.length > 0) {
        result = result.concat(userCalendars);
      } else{
        AsyncStorage.setItem('userCalendars', JSON.stringify([]));
      }
      return result;
    } else {
      console.log("No such document!");
      return [];
    }
  }

  static async processDataForCalendar(calendarData) {
    try {
      let markedDateJson = {};
      await calendarData.forEach((record) => {
        const date = moment(record.dateString).format("YYYY-MM-DD");
        //Chọn màu cho ngày đó là đỏ hay xanh
        let dots;
        let type;
        const isMoodle = record.isMoodle;
        if (isMoodle === "true") {
          dots = [{ color: "red" }];
          type = 0;
        } else {
          dots = [{ color: "green" }];
          type = 1;
        }

        if (markedDateJson[date]) {
          const oldType = markedDateJson[date].type;
          if (oldType !== 2 && oldType !== type) {
            dots = [{ color: "red" }, { color: "green" }];
            type = 2;
          } else if (oldType === 2) {
            dots = [{ color: "red" }, { color: "green" }];
            type = 2;
          }
        }
        markedDateJson[date] = {
          marked: true,
          dots: dots,
          selected: true,
          selectedColor: "#DBECF6",
          selectedTextColor: "black",
          type: type,
        };
      });

      return markedDateJson;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async addUserCalendar(title, textDate, textTime, content, isNotified) {
    try {
      console.log("inside function");

      const documentId = generateUUID(6);
      //23:17:32 -> 23:17
      const timeArray = textTime.split(":");
      const textTimeProcessed = timeArray[0] + ":" + timeArray[1];
      //25/3/2023 -> 2023/3/25
      const [day, month, year] = textDate.split("/");
      const textDateProcessed = `${year}-${month
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

      let identifier = "";
      /* ==================================Notification====================================== */
      if (isNotified) {
        //Thông báo cách tối thiểu 2h
        const deadlineDate = new Date(
          year,
          month - 1,
          day,
          timeArray[0],
          timeArray[1]
        );
        const now = new Date(Date.now());
        const diff = deadlineDate - now;
        const twoHours = 2 * 60 * 60 * 1000;
        if (diff > 0) {
          //2hours
          const twoHoursBeforeDeadlineTime = new Date(
            deadlineDate.getTime() - twoHours
          );
          const timeInfo = {
            year: Number(twoHoursBeforeDeadlineTime.getFullYear()),
            month: Number(twoHoursBeforeDeadlineTime.getMonth() + 1),
            day: Number(twoHoursBeforeDeadlineTime.getDate()),
            hour: Number(twoHoursBeforeDeadlineTime.getHours()),
            minute: Number(twoHoursBeforeDeadlineTime.getMinutes()),
          };
          identifier = await NotificationUtils.setNotificationAndGetIdentifer(
            title,
            content,
            timeInfo
          );
        }
      }
      const item = {
        id: documentId,
        title: title,
        timeString: textTimeProcessed,
        dateString: textDateProcessed,
        description: content,
        isMoodle: "false",
        isNotified: isNotified,
        identifier: identifier,
      };
      await StorageUtils.pushElementToArray("userCalendar", item);
      /* ==================================DB Adding====================================== */
      const user = auth.currentUser;
      const userRef = doc(collection(firestore, "calendar"), user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        updateDoc(
          userRef,
          { "calendar.user": arrayUnion(item) },
          { merge: true }
        );
      } else {
        setDoc(userRef, { calendar: { user: [item] } });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static async updateUserCalendar(elm, oldItem) {
    const user = auth.currentUser;

    const timeArray = elm.textTime.split(":");
    const vTime = timeArray[0] + ":" + timeArray[1];

    const [day, month, year] = elm.textDate.split("/");
    const textDateProcessed = `${year}-${month
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    let identifier = "";
    // ==================================Notification============================
    if (oldItem.isNotified && !elm.isNotified) {
      // Chỉ xóa thông báo khi cập nhật Thông báo -> Không thông báo
      NotificationUtils.cancelNotification(oldItem.identifier);
    } else {
      // Còn những trường hợp còn lại thì set thông báo mới, kiểm tra luôn vụ chỉ thông báo trước 2h
      await NotificationUtils.cancelNotification(oldItem.identifier);
      //Thông báo cách tối thiểu 2h
      const deadlineDate = new Date(
        year,
        month - 1,
        day,
        timeArray[0],
        timeArray[1]
      );
      const now = new Date(Date.now());
      const diff = deadlineDate - now;
      console.log("Diff: ", diff);
      const twoHours = 2 * 60 * 60 * 1000;
      if (diff > 0 ) {
        //2hours
        const twoHoursBeforeDeadlineTime = new Date(
          deadlineDate.getTime() - twoHours
        );
        const timeInfo = {
          year: Number(twoHoursBeforeDeadlineTime.getFullYear()),
          month: Number(twoHoursBeforeDeadlineTime.getMonth() + 1),
          day: Number(twoHoursBeforeDeadlineTime.getDate()),
          hour: Number(twoHoursBeforeDeadlineTime.getHours()),
          minute: Number(twoHoursBeforeDeadlineTime.getMinutes()),
        };
        identifier = await NotificationUtils.setNotificationAndGetIdentifer(
          elm.title,
          elm.content,
          timeInfo
        );
      }
    }
    // =====================================DB===================================

    const updatedData = {
      id: elm.id,
      title: elm.title,
      dateString: textDateProcessed,
      isNotified: elm.isNotified,
      timeString: vTime,
      description: elm.content,
      isMoodle: elm.isMoodle,
      identifier: identifier,
    };
    await StorageUtils.updateElementInArray('userCalendar', updatedData);
    try {
      const userRef = doc(collection(firestore, "calendar"), user.uid);
      const userDoc = await getDoc(userRef);
      const userCalendarData = userDoc.data().calendar.user;
      const itemIndex = userCalendarData.findIndex(
        (item) => item.id === elm.id
      );
      if (itemIndex !== -1) {
        const updatedUserCalendarList = [...userCalendarData];
        updatedUserCalendarList[itemIndex] = {
          ...updatedUserCalendarList[itemIndex],
          ...updatedData,
        };
        updateDoc(
          userRef,
          { "calendar.user": updatedUserCalendarList },
          { merge: true }
        );
        console.log("update OKK");
      } else {
        console.log("No todolist item found");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static deleteCalendar = async (c_item) => {
    const id = c_item.id;
    await StorageUtils.removeElementFromArray('userCalendar', id);
    console.log("Delete Calendar: ", id);
    try {
      // ==================================Notification============================
      if (c_item.isNotified) {
        NotificationUtils.cancelNotification(c_item.identifier);
      }
      // =====================================DB===================================
      const user = auth.currentUser;
      const userRef = doc(collection(firestore, "calendar"), user.uid);
      const userDoc = await getDoc(userRef);
      const userCalendar = userDoc.data().calendar.user;
      const updatedUserCalendar = userCalendar.filter((item) => item.id !== id);
      updateDoc(
        userRef,
        { "calendar.user": updatedUserCalendar },
        { merge: true }
      );
      console.log("delete OKK");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  static async loadNotificationAndUpdateDb() {
    try {
      const user = auth.currentUser;
      const userRef = doc(collection(firestore, "calendar"), user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data().calendar.user;
        if(userData != undefined && userData.length > 0){
          await loadNotificationAndUpdateOne(userData, userRef, false);
        }
      }
    } catch (error) {
      console.log("error: ", error);
    }

    async function loadNotificationAndUpdateOne(
      data,
      userRef,
      isMoodleProcess
    ) {
      const updatedCalendar = [...data];
      const itemIndexes = data
        .filter((item) => item.identifier != "")
        .map((item) => data.findIndex((obj) => obj.id == item.id));
      for (const i of itemIndexes) {
        const elem = data[i];
        const timeArray = elem.timeString.split(":");
        const [year, month, day] = elem.dateString.split("-");
        /* ==================================Notification====================================== */
        //Thông báo cách tối thiểu 2h
        const deadlineDate = new Date(
          year,
          month - 1,
          day,
          timeArray[0],
          timeArray[1]
        );
        const now = new Date(Date.now());
        // const now = new Date(2022,12-1, 1,0,0);
        const diff = deadlineDate - now;
        const twoHours = 2 * 60 * 60 * 1000;
        const threeDays = 60 * 1000 * 60 * 24 * 3;
        if (diff > 0 && diff <= threeDays) {
          // > 2hours and < 2 day
          const twoHoursBeforeDeadlineTime = new Date(
            deadlineDate.getTime() - twoHours
          );
          const timeInfo = {
            year: Number(twoHoursBeforeDeadlineTime.getFullYear()),
            month: Number(twoHoursBeforeDeadlineTime.getMonth() + 1),
            day: Number(twoHoursBeforeDeadlineTime.getDate()),
            hour: Number(twoHoursBeforeDeadlineTime.getHours()),
            minute: Number(twoHoursBeforeDeadlineTime.getMinutes()),
          };
          let identifier;
          if (isMoodleProcess) {
            identifier = await NotificationUtils.setNotificationAndGetIdentifer(
              elem.description,
              elem.title,
              timeInfo
            );
          } else {
            identifier = await NotificationUtils.setNotificationAndGetIdentifer(
              elem.title,
              elem.description,
              timeInfo
            );
          }
          updatedCalendar[i] = {
            ...updatedCalendar[i],
            identifier: identifier,
          };
        } else {
          updatedCalendar[i] = { ...updatedCalendar[i], identifier: "" };
        }
      }
      await AsyncStorage.setItem('userCalendar', JSON.stringify(updatedCalendar)); 
      if (isMoodleProcess) {
        updateDoc(
          userRef,
          { "calendar.moodle": updatedCalendar },
          { merge: true }
        );
      } else {
        updateDoc(
          userRef,
          { "calendar.user": updatedCalendar },
          { merge: true }
        );
      }
    }
  }

  static async loadAutoUpdateMoodleBackground(isAutoLogin){
    const user = auth.currentUser;
    const userRef = doc(collection(firestore, "user"), user.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()){
      //Reload the data moodle
      const data = userDoc.data();
      if(data.moodle.status == 1){
        await this.reloadMoodleCalendar();
        console.log("reloadMoodleCalendar done");
        //Auto update Background
        if(!isAutoLogin){
          await AutoUpdateService.registerAutoUpdateMoodleBackgroundTask();
        }
      }
    }
  }

}

export default CalendarService;
