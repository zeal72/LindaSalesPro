// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBF55NnztRi2vx6bdSnXLRerDaxuRyE-U4",
	authDomain: "zeabot-56259.firebaseapp.com",
	databaseURL: "https://zeabot-56259-default-rtdb.firebaseio.com",
	projectId: "zeabot-56259",
	storageBucket: "zeabot-56259.firebasestorage.app",
	messagingSenderId: "478240644511",
	appId: "1:478240644511:web:b953560d0c47dba0ec31aa",
	measurementId: "G-Q9Q9Q79FGR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Database
const auth = getAuth(app);
const db = getDatabase(app);


// Export everything you need
export {
	app,
	auth,
	db,
	// googleSignIn,
	GoogleAuthProvider,
	signInWithPopup,
	ref,
	set
};
