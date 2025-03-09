// // AuthContext.tsx
// import React, { createContext, useContext, useReducer, ReactNode } from "react";

// // Define types for medical history and previous submits
// interface MedHistory {
//   Epigastric_pain: string;
//   Jaundice: string;
//   bone_ache: string;
//   Diarrhea: string;
//   Headache: string;
//   Nausea: string;
//   Fever: string;
// }

// interface PreviousSubmits {
//   package: {
//     submitImg: string;
//     report: string;
//   };
// }

// // Define the User interface
// export interface User {
//   email: string;
//   password: string;
//   avatar: string;
//   name: string;
//   age: string;
//   Gender: string;
//   medHistory: MedHistory;
//   previousSubmits: PreviousSubmits;
// }

// // Our fake user data
// const FAKE_USER: User = {
//   email: "yossefehab@gmail.com",
//   password: "1234",
//   avatar: "https://i.pravatar.cc/100?u=zz",
//   name: "yossef",
//   age: "56",
//   Gender: "male",
//   medHistory: {
//     Epigastric_pain: "",
//     Jaundice: "",
//     bone_ache: "",
//     Diarrhea: "",
//     Headache: "",
//     Nausea: "",
//     Fever: "",
//   },
//   previousSubmits: {
//     package: {
//       submitImg: "",
//       report: "",
//     },
//   },
// };

// console.log(FAKE_USER);

// // Define our authentication state interface
// interface AuthState {
//   user: User | null;
//   isAuth: boolean;
//   error: boolean;
// }

// // Define action types
// type AuthAction =
//   | { type: "login"; payload: User }
//   | { type: "logout" }
//   | { type: "error" }
//   | { type: "resetError" };

// // Set up the initial state
// const initialState: AuthState = {
//   user: null,
//   isAuth: false,
//   error: false,
// };

// // Create our reducer function
// function reducer(state: AuthState, action: AuthAction): AuthState {
//   switch (action.type) {
//     case "login":
//       return {
//         ...state,
//         user: action.payload,
//         isAuth: true,
//         error: false, // reset error if login succeeds
//       };
//     case "logout":
//       return { ...state, user: null, isAuth: false };
//     case "error":
//       return { ...state, error: true };
//     case "resetError":
//       return { ...state, error: false };
//     default:
//       throw new Error("Unknown action");
//   }
// }

// // Define the context type that includes state and dispatch functions
// interface AuthContextType extends AuthState {
//   login: (email: string, password: string) => void;
//   logout: () => void;
/////   resetError: () => void;
// }

// // Create the context with an undefined initial value
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Define props for the provider component
// interface AuthProviderProps {
//   children: ReactNode;
// }

// // Create the AuthProvider component
// function AuthProvider({ children }: AuthProviderProps): JSX.Element {
//   const [{ user, isAuth, error }, dispatch] = useReducer(reducer, initialState);

//   // Login function: compare provided credentials to FAKE_USER.
//   function login(email: string, password: string) {
//     if (email === FAKE_USER.email && password === FAKE_USER.password) {
//       dispatch({ type: "login", payload: FAKE_USER });
//     } else {
//       dispatch({ type: "error" });
//       console.log("Invalid email or password");
//     }
//   }

//   function resetError() {
//     dispatch({ type: "resetError" });
//   }

//   function logout() {
//     dispatch({ type: "logout" });
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuth,
//         error,
//         login,
//         logout,
//         resetError,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // Custom hook for consuming the context
// function useAuth(): AuthContextType {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }

// export { AuthProvider, useAuth };

// import React, {
//   createContext,
//   useContext,
//   useReducer,
//   ReactNode,
//   useEffect,
// } from "react";
// import {
//   User as FirebaseUser,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   updateProfile,
//   signOut,
// } from "firebase/auth";
// import { auth, db } from "../firebase";
// import { doc, setDoc, getDoc } from "firebase/firestore";

// // Define the User interface
// export interface User {
//   uid: string;
//   email: string;
//   firstName?: string;
//   lastName?: string;
//   age?: string;
//   gender?: string;
//   avatar?: string;
// }

// // Define AuthState
// interface AuthState {
//   user: User | null;
//   isAuth: boolean;
//   error: string | null;
// }

// // Define action types
// type AuthAction =
//   | { type: "login"; payload: User }
//   | { type: "logout" }
//   | { type: "error"; payload: string }
//   | { type: "resetError" };

// // Initial state
// const initialState: AuthState = {
//   user: null,
//   isAuth: false,
//   error: null,
// };

// // Reducer function
// function reducer(state: AuthState, action: AuthAction): AuthState {
//   switch (action.type) {
//     case "login":
//       return { ...state, user: action.payload, isAuth: true, error: null };
//     case "logout":
//       return { ...state, user: null, isAuth: false };
//     case "error":
//       return { ...state, error: action.payload };
//     case "resetError":
//       return { ...state, error: null };
//     default:
//       throw new Error("Unknown action");
//   }
// }

// // Define context type
// interface AuthContextType extends AuthState {
//   signup: (
//     email: string,
//     password: string,
//     firstName: string,
//     lastName: string,
//     age: string,
//     gender: string
//   ) => void;
//   login: (email: string, password: string) => void;
//   logout: () => void;
//   resetError: () => void;
// }

// // Create context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Define provider props
// interface AuthProviderProps {
//   children: ReactNode;
// }

// // AuthProvider component
// function AuthProvider({ children }: AuthProviderProps): JSX.Element {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   // Signup function
//   async function signup(
//     email: string,
//     password: string,
//     firstName: string,
//     lastName: string,
//     age: string,
//     gender: string
//   ) {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const firebaseUser: FirebaseUser = userCredential.user;

//       // Update user profile with name
//       await updateProfile(firebaseUser, {
//         displayName: `${firstName} ${lastName}`,
//         photoURL:
//           gender === "male"
//             ? "https://i.pravatar.cc/100?u=male"
//             : "https://i.pravatar.cc/100?u=female",
//       });

//       // Save additional user details in Firestore
//       const userData: User = {
//         uid: firebaseUser.uid,
//         email,
//         firstName,
//         lastName,
//         age,
//         gender,
//         avatar: firebaseUser.photoURL || "",
//       };

//       await setDoc(doc(db, "users", firebaseUser.uid), userData);

//       dispatch({ type: "login", payload: userData });
//     } catch (error) {
//       dispatch({ type: "error", payload: error.message });
//       console.error("Signup Error:", error);
//     }
//   }

//   // Login function
//   async function login(email: string, password: string) {
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const firebaseUser: FirebaseUser = userCredential.user;

//       // Fetch user details from Firestore
//       const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
//       const userData = userDoc.exists() ? (userDoc.data() as User) : null;

//       dispatch({
//         type: "login",
//         payload: userData || {
//           uid: firebaseUser.uid,
//           email: firebaseUser.email || "",
//         },
//       });
//     } catch (error) {
//       dispatch({ type: "error", payload: error.message });
//       console.error("Login Error:", error);
//     }
//   }

//   // Logout function
//   async function logout() {
//     try {
//       await signOut(auth);
//       dispatch({ type: "logout" });
//     } catch (error) {
//       console.error("Logout Error:", error);
//     }
//   }

//   function resetError() {
//     dispatch({ type: "resetError" });
//   }

//   // Listen for authentication state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
//         const userData = userDoc.exists() ? (userDoc.data() as User) : null;
//         dispatch({
//           type: "login",
//           payload: userData || {
//             uid: firebaseUser.uid,
//             email: firebaseUser.email || "",
//           },
//         });
//       } else {
//         dispatch({ type: "logout" });
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{ ...state, signup, login, logout, resetError }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // Custom hook
// function useAuth(): AuthContextType {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }

// export { AuthProvider, useAuth };

//////////////////////////////////////////////////////////////////////////////////////////////

// import React, {
//   createContext,
//   useContext,
//   useReducer,
//   ReactNode,
//   useEffect,
// } from "react";
// import {
//   User as FirebaseUser,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   updateProfile,
//   signOut,
// } from "firebase/auth";
// import { auth, db } from "../firebase";
// import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// // Define User Interface
// export interface User {
//   uid: string;
//   email: string;
//   firstName?: string;
//   lastName?: string;
//   age?: string;
//   gender?: string;
//   avatar?: string;
//   createdAt?: any;
// }

// // Define AuthState
// interface AuthState {
//   user: User | null;
//   isAuth: boolean;
//   error: string | null;
// }

// // Define action types
// type AuthAction =
//   | { type: "login"; payload: User }
//   | { type: "logout" }
//   | { type: "error"; payload: string }
//   | { type: "resetError" };

// // Initial state
// const initialState: AuthState = {
//   user: null,
//   isAuth: false,
//   error: null,
// };

// // Reducer function
// function reducer(state: AuthState, action: AuthAction): AuthState {
//   switch (action.type) {
//     case "login":
//       return { ...state, user: action.payload, isAuth: true, error: null };
//     case "logout":
//       return { ...state, user: null, isAuth: false };
//     case "error":
//       return { ...state, error: action.payload };
//     case "resetError":
//       return { ...state, error: null };
//     default:
//       throw new Error("Unknown action");
//   }
// }

// // Define context type
// interface AuthContextType extends AuthState {
//   signup: (
//     email: string,
//     password: string,
//     firstName: string,
//     lastName: string,
//     age: string,
//     gender: string
//   ) => void;
//   login: (email: string, password: string) => void;
//   logout: () => void;
//   resetError: () => void;
// }

// // Create context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Define provider props
// interface AuthProviderProps {
//   children: ReactNode;
// }

// // AuthProvider component
// function AuthProvider({ children }: AuthProviderProps): JSX.Element {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   // Signup function
//   async function signup(
//     email: string,
//     password: string,
//     firstName: string,
//     lastName: string,
//     age: string,
//     gender: string
//   ) {
//     try {
//       // Check if user already exists in Firestore
//       const userExists = await getDoc(doc(db, "users", email));
//       if (userExists.exists()) {
//         throw new Error("An account with this email already exists.");
//       }

//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const firebaseUser: FirebaseUser = userCredential.user;

//       // Set unique avatar based on UID
//       const avatarUrl = `https://i.pravatar.cc/100?u=${firebaseUser.uid}`;

//       // Update Firebase user profile
//       await updateProfile(firebaseUser, {
//         displayName: `${firstName} ${lastName}`,
//         photoURL: avatarUrl,
//       });

//       // Prepare user data
//       const userData: User = {
//         uid: firebaseUser.uid,
//         email,
//         firstName,
//         lastName,
//         age,
//         gender,
//         avatar: avatarUrl,
//         createdAt: serverTimestamp(), // Store signup timestamp
//       };

//       // Save user details in Firestore
//       await setDoc(doc(db, "users", firebaseUser.uid), userData);

//       dispatch({ type: "login", payload: userData });
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         dispatch({ type: "error", payload: error.message });
//         console.error("Signup Error:", error.message);
//       } else {
//         dispatch({ type: "error", payload: "An unexpected error occurred." });
//         console.error("Unknown Signup Error:", error);
//       }
//     }
//   }

//   // Login function
//   async function login(email: string, password: string) {
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const firebaseUser: FirebaseUser = userCredential.user;

//       // Fetch user details from Firestore
//       const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
//       if (!userDoc.exists()) {
//         throw new Error("User profile not found. Please sign up.");
//       }

//       const userData = userDoc.data() as User;
//       dispatch({ type: "login", payload: userData });
//     } catch (error: unknown) {
//       let errorMessage = "Login failed. Please try again.";

//       if (error instanceof Error) {
//         if ((error as any).code === "auth/user-not-found") {
//           errorMessage = "No account found with this email.";
//         } else if ((error as any).code === "auth/wrong-password") {
//           errorMessage = "Incorrect password.";
//         } else {
//           errorMessage = error.message;
//         }
//       }

//       dispatch({ type: "error", payload: errorMessage });
//       console.error("Login Error:", error);
//     }
//   }

//   // Logout function
//   async function logout() {
//     try {
//       await signOut(auth);
//       dispatch({ type: "logout" });
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error("Logout Error:", error.message);
//       } else {
//         console.error("Unknown Logout Error:", error);
//       }
//     }
//   }

//   function resetError() {
//     dispatch({ type: "resetError" });
//   }

//   // Listen for authentication state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
//         const userData = userDoc.exists() ? (userDoc.data() as User) : null;
//         dispatch({
//           type: "login",
//           payload: userData || {
//             uid: firebaseUser.uid,
//             email: firebaseUser.email || "",
//           },
//         });
//       } else {
//         dispatch({ type: "logout" }); // ✅ Auto logout when session expires
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{ ...state, signup, login, logout, resetError }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // Custom hook
// function useAuth(): AuthContextType {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }

// export { AuthProvider, useAuth };

////////////////////////////////////////////////////////////////////////////////////////////////////////////\

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

// Define User Interface
export interface User {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  age?: string;
  gender?: string;
  avatar?: string;
  createdAt?: any;
  previousSubmits?: any[];
}

// Define AuthState
interface AuthState {
  user: User | null;
  isAuth: boolean;
  error: string | null;
}

// Define action types
type AuthAction =
  | { type: "login"; payload: User }
  | { type: "logout" }
  | { type: "error"; payload: string }
  | { type: "resetError" };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuth: false,
  error: null,
};

// Reducer function
function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuth: true, error: null };
    case "logout":
      return { ...state, user: null, isAuth: false };
    case "error":
      return { ...state, error: action.payload };
    case "resetError":
      return { ...state, error: null };
    default:
      throw new Error("Unknown action");
  }
}

// Define context type
interface AuthContextType extends AuthState {
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    age: string,
    gender: string
  ) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  resetError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Signup function
  async function signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    age: string,
    gender: string
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser: FirebaseUser = userCredential.user;

      const avatarUrl = `https://i.pravatar.cc/100?u=${firebaseUser.uid}`;

      await updateProfile(firebaseUser, {
        displayName: `${firstName} ${lastName}`,
        photoURL: avatarUrl,
      });

      const userData: User = {
        uid: firebaseUser.uid,
        email,
        firstName,
        lastName,
        age,
        gender,
        avatar: avatarUrl,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", firebaseUser.uid), userData);
      dispatch({ type: "login", payload: userData });
    } catch (error: any) {
      dispatch({ type: "error", payload: error.message });
    }
  }

  // Login function
  async function login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser: FirebaseUser = userCredential.user;

      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) throw new Error("User profile not found.");
      let userData = userDoc.data() as User;

      // Fetch previous submits
      const previousSubmitsRef = collection(
        db,
        "users",
        firebaseUser.uid,
        "previousSubmits"
      );
      const previousSubmitsSnapshot = await getDocs(previousSubmitsRef);
      const previousSubmits = previousSubmitsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      userData = { ...userData, previousSubmits };
      dispatch({ type: "login", payload: userData });
      console.log("✅ User Data:", userData);
    } catch (error: any) {
      dispatch({ type: "error", payload: error.message });
    }
  }

  // Logout function
  async function logout() {
    try {
      await signOut(auth);
      dispatch({ type: "logout" });
    } catch (error: any) {
      console.error("Logout Error:", error.message);
    }
  }

  function resetError() {
    dispatch({ type: "resetError" });
  }

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        let userData = userDoc.exists() ? (userDoc.data() as User) : null;

        if (userData) {
          const previousSubmitsRef = collection(
            db,
            "users",
            firebaseUser.uid,
            "previousSubmits"
          );
          const previousSubmitsSnapshot = await getDocs(previousSubmitsRef);
          const previousSubmits = previousSubmitsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          userData = { ...userData, previousSubmits };
        }

        dispatch({
          type: "login",
          payload: userData || {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
          },
        });
      } else {
        dispatch({ type: "logout" });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, signup, login, logout, resetError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
