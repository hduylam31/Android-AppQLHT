import { generateUUID } from "./uid";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { auth, firestore } from "../firebase";

class ScheduleService{

    static async loadScheduleData() {
        console.log("inside load schedule function");
        const user = auth.currentUser;
        const docRef = doc(firestore, "schedule", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const jsonObject = docSnap.data().schedule;
          console.log(jsonObject);
          return jsonObject;
        } else {
          console.log("No such document!");
          return [];
        }
      }

    static async addSchedule(data) {
        try {
          console.log("inside function");
          const documentId = generateUUID(6);
          const item = {
            id: documentId,
            title: data.title,
            DayOfWeek: data.DayOfWeek,
            lessonStart: data.selectedLessonStart,
            lessonEnd: data.selectedLessonEnd,
            location: data.location,
            note: data.note,
          };
          //firebase adding
          const user = auth.currentUser;
          const userRef = doc(collection(firestore, "schedule"), user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            await updateDoc(
              userRef,
              { "schedule": arrayUnion(item) },
              { merge: true }
            );
          } else {
            await setDoc(userRef, { schedule: [item] });
          }
        } catch (error) {
          console.log("error: ", error);
        
        }
    }

    static async updateSchedule(elm) {
        const user = auth.currentUser;
        const updatedData = {
          id: elm.c_id,
          title: elm.title,
          lessonStart: elm.selectedLessonStart,
          lessonEnd: elm.selectedLessonEnd,
          DayOfWeek: elm.DayOfWeek,
          location: elm.location,
          note: elm.note,
        };
        console.log(updatedData);
        try {
          const userRef = doc(collection(firestore, "schedule"), user.uid);
          const userDoc = await getDoc(userRef);
          const scheduleData = userDoc.data().schedule;
          const itemIndex = scheduleData.findIndex(
            (item) => item.id === elm.c_id
          );
          if (itemIndex !== -1) {
            const updateScheduleList = [...scheduleData];
            updateScheduleList[itemIndex] = {
              ...updateScheduleList[itemIndex],
              ...updatedData,
            };
            await updateDoc(
              userRef,
              { "schedule": updateScheduleList },
              { merge: true }
            );
            console.log("update OKK");
          } else {
            console.log("No schedule item found");
          }
        } catch (error) {
          console.log("error: ", error);
        }
      }

    static deleteCalendar = async (id) => {
        console.log("Delete Schedule: ", id);
        try {
            const user = auth.currentUser;
            const userRef = doc(collection(firestore, 'schedule'), user.uid);
            const userDoc = await getDoc(userRef);
            const scheduleList = userDoc.data().schedule;
            const updatedSchedulueList = scheduleList.filter(item => item.id !== id);
            await updateDoc(userRef, { schedule: updatedSchedulueList }, {merge: true});
            console.log("delete OKK");
        } catch (error) {
            console.log("error: ", error);
        }
    };
}

export default ScheduleService;