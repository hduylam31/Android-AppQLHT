import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";

class CredentialService {
  static handleLoginWithEmail = (username, password) => {
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with :", user.email);
      })
      .catch((error) => {
        console.log("Fail:");
        alert(error.message);
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
        alert(error.message);
      });
  };

  static handleResetEmail = (email) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Reset successfully");
      })
      .catch((error) => {
        console.log(error.message);
        alert("Reset fail");
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
