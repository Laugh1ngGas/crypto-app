import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from "../firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";

const authContext = React.createContext();

export function useAuth() {
  return useContext(authContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return () => unsubscribe();
  }, []);

  const initializeUser = async (user) => {
    if (user) {
      setCurrentUser(user);
      setUserLoggedIn(true);
      await loadWatchlist(user.uid);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
      setWatchlist([]);
    }
    setLoading(false);
  };

  const loadWatchlist = async (uid) => {
    try {
      const snapshot = await getDocs(collection(db, "users", uid, "watchlist"));
      const symbols = snapshot.docs
        .map((doc) => doc.id)
        .filter((id) => id !== "_placeholder");
      setWatchlist(symbols);
    } catch (error) {
      console.error("Failed to load watchlist:", error);
    }
  };

  const addToWatchlist = async (symbol) => {
    if (!currentUser) return;
    try {
      const watchlistRef = collection(db, "users", currentUser.uid, "watchlist");

      const placeholderDoc = doc(watchlistRef, "_placeholder");
      const placeholderSnap = await getDocs(watchlistRef);
      if (placeholderSnap.size === 1 && placeholderSnap.docs[0].id === "_placeholder") {
        await deleteDoc(placeholderDoc);
      }

      const coinRef = doc(watchlistRef, symbol);
      await setDoc(coinRef, {
        symbol,
        addedAt: new Date(),
      });

      setWatchlist((prev) => [...prev, symbol]);
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
    }
  };

  const removeFromWatchlist = async (symbol) => {
    if (!currentUser) return;
    try {
      const watchlistRef = collection(db, "users", currentUser.uid, "watchlist");
      const coinRef = doc(watchlistRef, symbol);
      await deleteDoc(coinRef);

      const updatedList = watchlist.filter((s) => s !== symbol);
      setWatchlist(updatedList);

      if (updatedList.length === 0) {
        await setDoc(doc(watchlistRef, "_placeholder"), {
          note: "Initial placeholder document.",
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
    }
  };

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
  };

  return (
    <authContext.Provider value={value}>
      {!loading && children}
    </authContext.Provider>
  );
}
