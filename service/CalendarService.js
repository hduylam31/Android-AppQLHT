import { generateUUID } from "./uid";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { auth, firestore } from "../firebase";
import moment from "moment";

class CalendarService {
  static async isMoodleActive() {
    try {
      const user = auth.currentUser;
      const userRef = doc(collection(firestore, "user"), user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const moodleToken = userDoc.data().moodleToken;
        if (moodleToken) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async getMoodleToken(username, password) {
    console.log("get token");
    url =
      "https://courses.fit.hcmus.edu.vn/login/token.php?username=" +
      username +
      "&password=" +
      password +
      "&service=moodle_mobile_app";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.errorcode === "invalidlogin") {
      return "error";
    }

    return data.token;
  }

  static async processLoginMoodle(username, password) {
    try {
      const moodleToken = await this.getMoodleToken(username, password);
      if (moodleToken !== "error") {
        console.log("Login moodle OK with token: ", moodleToken);
        //save token to user colection
        const user = auth.currentUser;
        const userRef = doc(collection(firestore, "user"), user.uid);
        updateDoc(userRef, { moodleToken: moodleToken });
        //load calendar moodle data
        await this.saveCalendarData(moodleToken);
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa");
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

  static async saveCalendarData(token) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    let currentMonthEvent = await this.fetchCalendarData(token, 11, 2022);
    let nextMonthEvent = await this.fetchCalendarData(token, 12, 2022);
    const twoMonthEvents = currentMonthEvent.concat(nextMonthEvent);

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
    data.weeks.forEach((week) => {
      week.days.forEach((day) => {
        day.events.forEach((event) => {
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
          const eventItem = {
            id: id,
            title: event.name,
            description: event.course.fullname,
            isMoodle: "true",
            isNotified: true,
            dateString: dateString,
            timeString: timeString,
          };
          events.push(eventItem);
        });
      });
    });
    return events;
  }

  static async loadCalendarData() {
    console.log("inside load calendar function");
    const user = auth.currentUser;
    const docRef = doc(firestore, "calendar", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const jsonObject = docSnap.data().calendar;
      let result = [];
      const moodleCalendars = jsonObject.moodle;
      if (moodleCalendars && moodleCalendars.length > 0) {
        result = result.concat(moodleCalendars);
      }
      const userCalendars = jsonObject.user;
      if (userCalendars && userCalendars.length > 0) {
        result = result.concat(userCalendars);
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

  static async addUserCalendar(title, textDate, textTime, content) {
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
      // const textDateProcessed = textDate.split('/').reverse().join('-');
      const item = {
        id: documentId,
        title: title,
        timeString: textTimeProcessed,
        dateString: textDateProcessed,
        description: content,
        isMoodle: "false",
        isNotified: true,
      };
      //firebase adding
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

  static async updateUserCalendar(elm) {
    console.log("Update User Calendar: ", elm);
    const user = auth.currentUser;

    const timeArray = elm.textTime.split(":");
    const vTime = timeArray[0] + ":" + timeArray[1];

    const [day, month, year] = elm.textDate.split("/");
    const textDateProcessed = `${year}-${month
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    const updatedData = {
      id: elm.c_id,
      title: elm.title,
      dateString: textDateProcessed,
      isNotified: elm.isNotified,
      timeString: vTime,
      description: elm.content,
      isMoodle: elm.c_isMoodle,
    };
    console.log("update data: ", updatedData);
    try {
      const userRef = doc(collection(firestore, "calendar"), user.uid);
      const userDoc = await getDoc(userRef);
      console.log("data: ", userDoc.data().calendar.user);
      console.log("id: ", elm.c_id);
      const userCalendarData = userDoc.data().calendar.user;
      const itemIndex = userCalendarData.findIndex(
        (item) => item.id === elm.c_id
      );
      if (itemIndex !== -1) {
        const updatedUserCalendarList = [...userCalendarData];
        updatedUserCalendarList[itemIndex] = {
          ...updatedUserCalendarList[itemIndex],
          ...updatedData,
        };
        await updateDoc(
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
}

export default CalendarService;
