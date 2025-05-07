// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
// src/context/AuthContext.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  // signInWithRedirect,
  getAdditionalUserInfo,
} from "firebase/auth"; // Import from firebase/auth
import { auth, googleProvider, db } from "../firebase/Config"; // Keep these imports
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create user in both Auth and Firestore
  async function signup(email, password, additionalData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        ...additionalData,
        createdAt: new Date(),
        lastLogin: new Date(),
      });

      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update last login time
      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          lastLogin: new Date(),
        },
        { merge: true }
      );

      return userCredential;
    } catch (error) {
      throw error;
    }
  }
  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const additionalInfo = getAdditionalUserInfo(result);

      // Check if user is new
      if (additionalInfo?.isNewUser) {
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          provider: "google",
          createdAt: new Date(),
          lastLogin: new Date(),
        });
      } else {
        // Update last login for existing users
        await setDoc(
          doc(db, "users", result.user.uid),
          {
            lastLogin: new Date(),
          },
          { merge: true }
        );
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // You could fetch additional user data here if needed
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );

  // ... rest of provider ...
}

export function useAuth() {
  return useContext(AuthContext);
}
