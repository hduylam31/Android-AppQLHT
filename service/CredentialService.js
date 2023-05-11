import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

class CredentialService {
  static autoLogin = async () => {
    const username = await AsyncStorage.getItem("username");
    const password = await AsyncStorage.getItem("password");
    if (username && password) {
      return await signInWithEmailAndPassword(auth, username, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log("Logged in with :", user.email);
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    } else {
      return false;
    }
  };

  static handleLoginWithEmail = async (username, password) => {
    return await signInWithEmailAndPassword(auth, username, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with :", user.email);
        AsyncStorage.setItem("username", username);
        AsyncStorage.setItem("password", password);
        return true;
      })
      .catch((error) => {
        console.log("Fail:");
        if (error.code === "auth/wrong-password") {
          // Thông báo lỗi: "Mật khẩu không chính xác"
          Alert.alert("Đăng nhập không thành công", "Mật khẩu không chính xác");
        } else if (error.code === "auth/user-not-found") {
          // Thông báo lỗi: "Email chưa được đăng ký"
          Alert.alert(
            "Đăng nhập không thành công",
            "Tài khoản chưa được đăng kí"
          );
        } else {
          // Thông báo lỗi mặc định của Firebase Auth
          Alert.alert("Đăng nhập không thành công", error.message);
        }
        return false;
      });
  };

  static handleRegister = async (name, email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log("Successfully register withh", user.email);
        const userRef = doc(collection(firestore, "user"), user.uid);
        await setDoc(userRef, { "name": name, "isMoodleCalendarNotified": true, "isUserCalendarNotified": true });
        console.log("Successfully register user name", name);
        return true;
      })
      .catch((error) => {
        console.log("Không thể đăng kí", error);
        if (error.code === "auth/email-already-in-use") {
          // Thông báo lỗi: "Địa chỉ email đã được sử dụng để tạo tài khoản khác"
          Alert.alert("Đăng kí không thành công", "Địa chỉ Email đã tồn tại");
        } else if (error.code === "auth/invalid-email") {
          // Thông báo lỗi: "Địa chỉ email không hợp lệ"
          Alert.alert("Đăng kí không thành công", "Địa chỉ Email không hợp lệ");
        } else if (error.code === "auth/weak-password") {
          // Thông báo lỗi: "Mật khẩu phải có ít nhất 6 kí tự"
          Alert.alert(
            "Đăng kí không thành công",
            "Mật khẩu phải có ít nhất 6 kí tự"
          );
        } else {
          Alert.alert("Đăng kí không thành công", error.message);
        }
        return false;
      });
  };

  static handleResetEmail = async (email) => {
    return await sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Reset successfully");
        return true;
      })
      .catch((error) => {
        console.log(error.message);
        if (error.code === "auth/invalid-email") {
          // Thông báo lỗi: "Địa chỉ email không hợp lệ"
          Alert.alert("Gửi không thành công", "Địa chỉ Email không hợp lệ");
        } else if (error.code === "auth/user-not-found") {
          // Thông báo lỗi: "Tài khoản không tồn tại hoặc đã bị xóa"
          Alert.alert(
            "Gửi không thành công",
            "Địa chỉ Email không tồn tại hoặc đã bị xóa"
          );
        } else {
          // Thông báo lỗi mặc định của Firebase Auth
          Alert.alert("Gửi không thành công", error.message);
        }
        return false;
      });
  };
  static changePassword = async (newPassword) => {
    const user = auth.currentUser;
    return await updatePassword(user, newPassword)
      .then(async () => {
        console.log("changePassword OK");
        await AsyncStorage.setItem("password", newPassword);
        return true;
      })
      .catch((error) => {
        console.log("changePassword: ", error);
        if (error.code === "auth/weak-password") {
          // Thông báo lỗi: "Mật khẩu phải có ít nhất 6 kí tự"
          Alert.alert(
            "Đối mật khẩu không thành công",
            "Mật khẩu phải có ít nhất 6 kí tự"
          );
        }
        return false;
      });
  };
}

export default CredentialService;
