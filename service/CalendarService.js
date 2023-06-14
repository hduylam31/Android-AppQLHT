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
import * as he from "he";
import * as BackgroundFetch from "expo-background-fetch";
import Constants from "../domain/Constants";
import StorageUtils from "./StorageUtils";
import ScheduleService from "./ScheduleService";
import DateTimeUtils from "./DateTimeUtils";

class CalendarService {
  static async isMoodleActive() {
    try {
      const moodleStatusStorage = await AsyncStorage.getItem("moodleStatus");
      if (moodleStatusStorage != null) {
        return parseInt(moodleStatusStorage);
      }

      const user = auth.currentUser;
      const userRef = doc(collection(firestore, "user"), user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const moodleStatus = userDoc.data().moodle.status;
        if (moodleStatus) {
          AsyncStorage.setItem("moodleStatus", moodleStatus.toString());
          return moodleStatus;
        } else {
          return 0;
        }
      }
    } catch (error) {
      return 0;
    }
  }

  static async isNoti() {
    try {
      const user = auth.currentUser;
      const userRef = doc(collection(firestore, "user"), user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return {
          isMoodleCalendarNotified: userDoc.data().isMoodleCalendarNotified,
          isUserCalendarNotified: userDoc.data().isUserCalendarNotified,
        };
      }
    } catch (error) {
      return true;
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
    AsyncStorage.setItem("moodleToken", data.token);
    return data.token;
  }

  static async processLoginMoodle(username, password) {
    try {
      const moodleToken = await this.getMoodleToken(username, password);
      if (moodleToken !== "error") {
        console.log("Login moodle OK with token: ", moodleToken);
        //save token to user colection
        await AsyncStorage.setItem("moodleStatus", "1");
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, "user"), user.uid);
        updateDoc(userRef, { moodle: { token: moodleToken, status: 1 } });
        //load calendar moodle data
        await this.saveCalendarData(moodleToken);
        //Auto update Background
        await AutoUpdateService.registerAutoUpdateMoodleBackgroundTask();
        return 1;
      } else {
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

    const moodleStatus = await AsyncStorage.getItem("moodleStatus");
    if (moodleStatus != null && parseInt(moodleStatus) == 1) {
      const moodleToken = await AsyncStorage.getItem("moodleToken");
      if (moodleToken != null) {
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
        AsyncStorage.setItem("moodleStatus", status.toString());
        if (status === 1) {
          const token = moodle.token;
          AsyncStorage.setItem("moodleToken", token);
          await this.saveCalendarData(token);
          console.log("save saveCalendarData done");
        }
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  static async turnOffCalendarNotification(isMoodleCalendar) {
    try {
      console.log("inside turnOffCalendarNotification");
      var calendarData = [];
      const user = auth.currentUser;
      const userRef2 = doc(collection(firestore, "user"), user.uid);
      const userRef = doc(collection(firestore, "calendar"), user.uid);
      const userDoc = await getDoc(userRef);
      const calendarType = isMoodleCalendar ? "moodleCalendar" : "userCalendar";

      //Get all data
      const calendarDataStorage = await AsyncStorage.getItem(calendarType);
      if (calendarDataStorage != null) {
        calendarData = JSON.parse(calendarDataStorage);
      } else {
        if (userDoc.exists()) {
          calendarData = userDoc.data().calendar.moodle;
        }
      }
      // Delete all noti + update identifer = ""
      if (calendarData.length > 0) {
        calendarData.forEach((item) => {
          if (item.isNotified && item.identifier != "") {
            NotificationUtils.cancelNotification(item.identifier);
          }
        });
        await Promise.all(
          calendarData.map((item) => {
            if (item.isNotified && item.identifier != "") {
              item.identifier = "";
            }
          })
        );
      }
      //Update data in DB + Cache, Save global
      if (isMoodleCalendar) {
        await AsyncStorage.setItem(
          "moodleCalendar",
          JSON.stringify(calendarData)
        );
        updateDoc(userRef, { "calendar.moodle": calendarData });
        updateDoc(userRef2, { isMoodleCalendarNotified: false });
      } else {
        await AsyncStorage.setItem(
          "userCalendar",
          JSON.stringify(calendarData)
        );
        updateDoc(userRef, { "calendar.user": calendarData });
        updateDoc(userRef2, { isUserCalendarNotified: false });
      }
    } catch (error) {
      console.log("turnOffCalendarNotification: ", error);
    }
  }

  static async turnOnCalendarNotification(isMoodleCalendar) {
    try {
      console.log("inside turnOnCalendarNotification");
      var calendarData = [];
      const user = auth.currentUser;
      const userRef2 = doc(collection(firestore, "user"), user.uid);
      const userRef = doc(collection(firestore, "calendar"), user.uid);
      const userDoc = await getDoc(userRef);
      const calendarType = isMoodleCalendar ? "moodleCalendar" : "userCalendar";
      //Get all data
      const calendarDataStorage = await AsyncStorage.getItem(calendarType);
      if (calendarDataStorage != null) {
        calendarData = JSON.parse(calendarDataStorage);
      } else {
        if (userDoc.exists()) {
          calendarData = userDoc.data().calendar.moodle;
        }
      }
      //Check if item is Notified => set identifer
      if (calendarData.length > 0) {
        await Promise.all(
          calendarData.map(async (item) => {
            if (item.isNotified && item.identifier == "") {
              const timeArray = item.timeString.split(":");
              const [year, month, day] = item.dateString.split("-");
              const deadlineDate = new Date(
                year,
                month - 1,
                day,
                timeArray[0],
                timeArray[1]
              );
              const now = new Date(Date.now());
              const diff = deadlineDate - now;

              if (diff > 0) {
                //2hours
                const twoHoursBeforeDeadlineTime = new Date(
                  deadlineDate.getTime() - item.rangeTimeInfo.time * 1000
                );
                const timeInfo = {
                  year: Number(twoHoursBeforeDeadlineTime.getFullYear()),
                  month: Number(twoHoursBeforeDeadlineTime.getMonth() + 1),
                  day: Number(twoHoursBeforeDeadlineTime.getDate()),
                  hour: Number(twoHoursBeforeDeadlineTime.getHours()),
                  minute: Number(twoHoursBeforeDeadlineTime.getMinutes()),
                };
                identifier =
                  await NotificationUtils.setNotificationAndGetIdentifer(
                    item.description,
                    item.title,
                    timeInfo
                  );
                item.identifier = identifier;
              }
            }
          })
        );
      }
      //Update data in DB + Cache, Save global
      if (isMoodleCalendar) {
        await AsyncStorage.setItem(
          "moodleCalendar",
          JSON.stringify(calendarData)
        );
        updateDoc(userRef, { "calendar.moodle": calendarData });
        updateDoc(userRef2, { isMoodleCalendarNotified: true });
      } else {
        await AsyncStorage.setItem(
          "userCalendar",
          JSON.stringify(calendarData)
        );
        updateDoc(userRef, { "calendar.user": calendarData });
        updateDoc(userRef2, { isUserCalendarNotified: true });
      }
    } catch (error) {
      console.log("turnOnCalendarNotification: ", error);
    }
  }

  static async unRegisterMoodleNotification() {
    const user = auth.currentUser;
    const userRef = doc(collection(firestore, "calendar"), user.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const moodleData = userDoc.data().calendar.moodle;
      if (!moodleData) return;
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
      try {
        BackgroundFetch.unregisterTaskAsync(Constants.BACKGROUND_FETCH_TASK);
      } catch (error) {
        console.log("Ke loi nay di: ", error);
      }

      AsyncStorage.setItem("moodleStatus", status.toString());
      updateDoc(userRef, { "moodle.status": status, "moodle.token": "" });
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
    const notiConfig = await this.loadNotiConfig();
    const rangeTime = notiConfig.moodleNotiConfig.time;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    console.log("rangeTime: ", rangeTime);
    let currentMonthEvent = await this.fetchCalendarData(
      token,
      currentMonth,
      currentYear,
      rangeTime
    );
    if (currentMonthEvent === "error") {
      console.log("error token");
      await this.logOutMoodle(-1);
      return;
    }

    let nextMonthEvent = await this.fetchCalendarData(
      token,
      nextMonth,
      nextMonthYear,
      rangeTime
    );
    const twoMonthEvents = currentMonthEvent.concat(nextMonthEvent);
    // =====================================DB===================================
    await AsyncStorage.setItem(
      "moodleCalendar",
      JSON.stringify(twoMonthEvents)
    );

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

  static async fetchCalendarData(token, month, year, rangeTime) {
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
    const notiConfig = await this.isNoti();
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
          if (notiConfig.isMoodleCalendarNotified) {
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
            const twoHours = rangeTime * 1000;
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
                rangeTimeInfo: {
                  time: twoHours / 1000,
                  type: "4",
                  customType: "",
                  customTime: "",
                  durationTime: "",
                  durationType: "",
                },
              };
              events.push(eventItem);
            });
            promises.push(eventItemPromise);
          }
        });
      });
    });
    return Promise.all(promises).then(() => {
      return events;
    });
  }

  static async loadCalendarData() {
    console.log("inside load calendar function");

    const moodleCalendar = await AsyncStorage.getItem("moodleCalendar");
    const userCalendar = await AsyncStorage.getItem("userCalendar");
    if (moodleCalendar != null || userCalendar != null) {
      let storageResult = [];
      if (moodleCalendar != null) {
        storageResult = storageResult.concat(JSON.parse(moodleCalendar));
      }

      if (userCalendar != null) {
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
        AsyncStorage.setItem("moodleCalendar", JSON.stringify(moodleCalendars));
        result = result.concat(moodleCalendars);
      } else {
        AsyncStorage.setItem("moodleCalendar", JSON.stringify([]));
      }
      const userCalendars = jsonObject.user;
      if (userCalendars && userCalendars.length > 0) {
        result = result.concat(userCalendars);
      } else {
        AsyncStorage.setItem("userCalendars", JSON.stringify([]));
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

  static async addUserCalendar(
    title,
    textDate,
    textTime,
    content,
    isNotified,
    rangeTimeInfo
  ) {
    try {
      console.log("inside function");
      const notiConfig = await this.isNoti();
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
      if (isNotified && notiConfig.isUserCalendarNotified) {
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
        if (diff > 0) {
          //2hours
          const twoHoursBeforeDeadlineTime = new Date(
            deadlineDate.getTime() - rangeTimeInfo.time * 1000
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
        rangeTimeInfo: {
          time: rangeTimeInfo.time,
          type: rangeTimeInfo.type,
          customType: rangeTimeInfo.customType,
          customTime: rangeTimeInfo.customTime,
          durationTime: rangeTimeInfo.durationTime, 
          durationType: rangeTimeInfo.durationType
        },
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

    const notiConfig = await this.isNoti();
    // ==================================Notification============================
    if (
      oldItem.isNotified &&
      !elm.isNotified &&
      notiConfig.isUserCalendarNotified
    ) {
      // Chỉ xóa thông báo khi cập nhật Thông báo -> Không thông báo
      NotificationUtils.cancelNotification(oldItem.identifier);
    } else if (notiConfig.isUserCalendarNotified) {
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

      if (diff > 0) {
        //2hours
        const twoHoursBeforeDeadlineTime = new Date(
          deadlineDate.getTime() - elm.rangeTimeInfo.time * 1000
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
      rangeTimeInfo: {
        time: elm.rangeTimeInfo.time,
        type: elm.rangeTimeInfo.type,
        customType: elm.rangeTimeInfo.customType,
        customTime: elm.rangeTimeInfo.customTime,
        durationTime: elm.rangeTimeInfo.durationTime,
        durationType: elm.rangeTimeInfo.durationType
      },
    };
    await StorageUtils.updateElementInArray("userCalendar", updatedData);
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
    await StorageUtils.removeElementFromArray("userCalendar", id);
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
        if (userData != undefined && userData.length > 0) {
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
        const twoHours = elem.rangeTimeInfo.time * 1000;
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
      await AsyncStorage.setItem(
        "userCalendar",
        JSON.stringify(updatedCalendar)
      );
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

  static async loadAutoUpdateMoodleBackground(isAutoLogin) {
    const user = auth.currentUser;
    const userRef = doc(collection(firestore, "user"), user.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      //Reload the data moodle
      const data = userDoc.data();
      if (data.moodle.status == 1) {
        await this.reloadMoodleCalendar();
        console.log("reloadMoodleCalendar done");
        //Auto update Background
        if (!isAutoLogin) {
          await AutoUpdateService.registerAutoUpdateMoodleBackgroundTask();
        }
      }
    }
  }

  static async saveNotiConfig(moodleConfig) {
    try {
      console.log(moodleConfig, userConfig);
      const user = auth.currentUser;
      const userRef = doc(collection(firestore, "user"), user.uid);
      updateDoc(userRef, { moodleNotiConfig: moodleConfig });
    } catch (error) {
      console.log("saveNotiConfig: ", error);
    }
  }

  static async loadNotiConfig() {
    try {
      const user = auth.currentUser;
      const userRef = doc(collection(firestore, "user"), user.uid);
      const userDoc = await getDoc(userRef);
      return {
        moodleNotiConfig: userDoc.data().moodleNotiConfig,
      };
    } catch (error) {
      console.log("saveNotiConfig: ", error);
    }
  }

  static async getTimeRange(fromTimeText, toTimeText, fromDateText, toDateText){
    var fromDate = DateTimeUtils.convertToDate(fromDateText);
    var toDate = DateTimeUtils.convertToDate(toDateText);

    var timeRanges = [];

    var currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      var fromTime = fromTimeText === '00:00' ? '06:00:00' : fromTimeText + ":00";
      var toTime = toTimeText === '00:00' ? '23:59:59' : toTimeText + ":00";
      var currentTimeRange = {
        date: currentDate.toLocaleDateString(),
        fromTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), parseInt(fromTime.substring(0, 2)), parseInt(fromTime.substring(3, 5)), parseInt(fromTime.substring(6, 8))),
        toTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), parseInt(toTime.substring(0, 2)), parseInt(toTime.substring(3, 5)), parseInt(toTime.substring(6, 8))),
        dayOfWeek: DateTimeUtils.getDayOfWeek(currentDate)
        
      };

      timeRanges.push(currentTimeRange);
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return timeRanges;
  }

  static async normalizedCalendar(calendarList){
    return calendarList.map(item => {
      var date = new Date(item.dateString);
      var fromTimeText = item.timeString + ":00";
      var fromTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(fromTimeText.substring(0, 2)), parseInt(fromTimeText.substring(3, 5)), parseInt(fromTimeText.substring(6, 8)));
      var limitTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

      var durationSecond;
      var durationType = item.rangeTimeInfo.durationType;
      var durationTime = parseInt(item.rangeTimeInfo.durationTime);
      if(durationType == "1"){
        durationSecond = durationTime*60;
      } else if(durationType == "2"){
        durationSecond = durationTime*60*60;
      } else if(durationType == "3"){
        durationSecond = durationTime*60*60*24;
      }
      var toTime = new Date(fromTime.getTime() + durationSecond*1000);
      if(toTime > limitTime){
        toTime = limitTime;
      }

      var currentTimeRange = {
        date: date.toLocaleDateString(),
        fromTime: fromTime,
        toTime: toTime,
        dayOfWeek: DateTimeUtils.getDayOfWeek(date),
        isMoodle: item.isMoodle
      };

      return currentTimeRange;
    });
  }

  static async normalizedTKB(tkbList){
    return tkbList.map(item => {
      var currentTimeRange = {
        fromTime: item.lessonInfo.timeStart + ":00",
        toTime: item.lessonInfo.timeEnd + ":00",
        dayOfWeek: item.DayOfWeek
      };
      return currentTimeRange;
    })
  }

  static async hasOverlap(time1, time2) {
    return (time1.fromTime <= time2.toTime) && (time1.toTime >= time2.fromTime);
  }

  static async subtractTime(timeRequest, calendarTime){
    const result = [];

    timeRequest = timeRequest.sort((a,b) => a.fromTime - b.fromTime);
    calendarTime = calendarTime.sort((a,b) => a.fromTime - b.fromTime);
    
    timeRequest.forEach(timeReq => {
      const timeRanges = [];
      var left = timeReq.fromTime;
      var right;
      
      calendarTime.forEach(userTime => {
        if(timeReq.date == userTime.date && this.hasOverlap(timeReq, userTime)){
          if (timeReq.fromTime > userTime.fromTime && timeReq.fromTime < userTime.toTime) {
            timeRanges.push({
              date: timeReq.date,
              fromTime: timeReq.fromTime,
              toTime: userTime.fromTime,
              dayOfWeek: timeReq.dayOfWeek
            });
            left = userTime.fromTime;
          } else{
            right = userTime.fromTime;
            if(right > left){
              timeRanges.push({
                date: timeReq.date,
                fromTime: left,
                toTime: right,
                dayOfWeek: timeReq.dayOfWeek
              });
            }
            left = userTime.toTime > left ? userTime.toTime: left;
          }
        }
      })

      if (timeRanges.length > 0) {
        // Thêm các khoảng thời gian vào kết quả
        result.push(...timeRanges);
        if(left < timeReq.toTime){
          result.push({
              date: timeReq.date,
              fromTime: left,
              toTime: timeReq.toTime,
              dayOfWeek: timeReq.dayOfWeek 
            });
        }
      } else{
        result.push(timeReq);
      }

    })
    return result;
  }

  static async fusionCalendarWithTKB(tkbList, userList, timeRequest){
    const result = [...userList];
    timeRequest.forEach(timeReq => {
      const date = DateTimeUtils.convertToDate(timeReq.date);
      const dayOfWeek = timeReq.dayOfWeek;
      tkbList.forEach(item => {
        if(item.dayOfWeek == dayOfWeek){
          var fromTimeText = item.fromTime;
          var fromTime  = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(fromTimeText.substring(0, 2)), parseInt(fromTimeText.substring(3, 5)), parseInt(fromTimeText.substring(6, 8)));
          var toTimeText = item.toTime;
          var toTime  = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(toTimeText.substring(0, 2)), parseInt(toTimeText.substring(3, 5)), parseInt(toTimeText.substring(6, 8)));
          var itemResult = {
            date: timeReq.date,
            dayOfWeek: dayOfWeek,
            fromTime: fromTime,
            toTime: toTime
          }
          result.push(itemResult);
        }
      })
    })
    return result;
  }

  static async findFreeCalendar(durationTime, fromTime, toTime, fromDate, toDate, isCheckMoodle, isCheckTKB) {
    try {
      var result = [];
      //===============================================
      var timeRequest = this.getTimeRange(fromTime, toTime, fromDate, toDate)._j;
      console.log("TimeRequest: ", timeRequest.map(item => {
        return {...item, fromTime: item.fromTime.toLocaleTimeString(), toTime: item.toTime.toLocaleTimeString()} 
      }));

      var calendarList = await this.loadCalendarData();
      var normCalendar = await this.normalizedCalendar(calendarList);
      var userCalendar = normCalendar.filter(item => item.isMoodle == "false");
      
      console.log("normCalendar: ", normCalendar.map(item => {
        return {...item, fromTime: item.fromTime.toLocaleTimeString(), toTime: item.toTime.toLocaleTimeString()} 
      }))

      if(!isCheckTKB){
        var tkbList = await ScheduleService.loadScheduleData();
        var tkbNorm = await this.normalizedTKB(tkbList);
        userCalendar = await this.fusionCalendarWithTKB(tkbNorm, userCalendar, timeRequest);

        console.log("userCalendar with TKB: ", userCalendar.map(item => {
          return {...item, fromTime: item.fromTime.toLocaleTimeString(), toTime: item.toTime.toLocaleTimeString()} 
        }))
      }

      var subtractCalendar = await this.subtractTime(timeRequest, userCalendar);
      console.log("subtractCalendar: ", subtractCalendar.map(item => {
        return {...item, fromTime: item.fromTime.toLocaleTimeString(), toTime: item.toTime.toLocaleTimeString()} 
      }));



      var filterWithDuration = subtractCalendar.filter(item => item.toTime.getTime() - item.fromTime.getTime() >= durationTime*1000);
      console.log("filterWithDuration: ", filterWithDuration.map(item => {
        return {...item, fromTime: item.fromTime.toLocaleTimeString(), toTime: item.toTime.toLocaleTimeString()} 
      }));

      if(isCheckMoodle){
        var moodleCalendar = normCalendar.filter(item => item.isMoodle == "true");
        var moodleDates =  moodleCalendar.map(item => item.date);
        filterWithDuration = filterWithDuration.filter(item => !moodleDates.includes(item.date));
      }

      console.log("filterWithDuration if CheckMoodle: ", filterWithDuration.map(item => {
        return {...item, fromTime: item.fromTime.toLocaleTimeString(), toTime: item.toTime.toLocaleTimeString()} 
      }));

      return filterWithDuration.map((item, index) => {
        return {
          id: index, 
          date: item.date,
          timeStart: item.fromTime.toLocaleTimeString().substring(0,5), 
          timeEnd: item.toTime.toLocaleTimeString().substring(0,5)
        } 
      });
      
    } catch (error) {
      console.log("saveNotiConfig: ", error);
    }
  }
}

export default CalendarService;
