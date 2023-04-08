import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { Alert } from "react-native";

class CredentialService {
  static handleLoginWithEmail = (username, password) => {
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with :", user.email);
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
      });
  };

  static handleRegister = (name, email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log("Successfully register withh", user.email);
        console.log("1");
        console.log("FireStore", firestore);
        console.log("2");
        const userRef = doc(collection(firestore, "user"), user.uid);
        await setDoc(userRef, { name });
        console.log("Successfully register user name", name);
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
      });
  };

  static handleResetEmail = (email) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Reset successfully");
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
      });
  };

  //   static handleGoogleLogin = async () => {
  //     try {
  //       console.log("AAAAA");
  //       // Sign in with the Google provider
  //       await GoogleSignin.hasPlayServices();
  //       const userInfo = await GoogleSignin.signIn();
  //       console.log("Logged in with Google:", userInfo);
  //     } catch (error) {
  //       // Handle errors here
  //       console.log("Google login failed:", error);
  //     }
  //   };

  static handleFbLogin = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        console.log("b");
        const user = result.user;
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        console.log("Ok with ", user);
      })
      .catch((error) => {
        // Handle Errors here.
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.log("fail with: ", credential);
      });
  };
}

export default CredentialService;
