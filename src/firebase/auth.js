import { auth, db } from "./firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { doc, setDoc, getDoc, collection } from "firebase/firestore";

export const doCreateUserWithEmailAndPassword = async (
  email,
  password,
  nickname
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: nickname,
    });

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      nickname: nickname,
      createdAt: new Date(),
      settings: {
        theme: "dark",
        preferredCurrency: "usd",
        language: "en",
      },
      profileData: {
        displayName: nickname,
      },
    });

    const portfolioRef = collection(db, "users", user.uid, "portfolio");
    await setDoc(doc(portfolioRef, "_placeholder"), {
      note: "Initial placeholder document.",
      createdAt: new Date(),
    });

    await sendEmailVerification(user, {
      url: `${window.location.origin}/signin`,
    });

    await signOut(auth);

    return userCredential;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      nickname: user.displayName || "",
      createdAt: new Date(),
      settings: {
        theme: "dark",
        preferredCurrency: "usd",
        language: "en",
      },
      profileData: {
        displayName: user.displayName || "",
      },
    });

    const portfolioRef = collection(db, "users", user.uid, "portfolio");
    await setDoc(doc(portfolioRef, "_placeholder"), {
      note: "Initial placeholder document.",
      createdAt: new Date(),
    });
  }

  return result;
};

export const doSignOut = () => {
  return signOut(auth);
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/`,
  });
};
