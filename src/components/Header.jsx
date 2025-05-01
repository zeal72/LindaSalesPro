import { MdRocketLaunch } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { HiMenuAlt2 } from "react-icons/hi";
import { useState, useEffect } from "react";
import { auth, db } from "../../Firebase.config"; // Adjust path as needed
import { ref, onValue } from "firebase/database";

export default function Header({ toggleSidebar, userInfo }) {
	const [username, setUsername] = useState("User");

	useEffect(() => {
		// If userInfo is already passed as prop, use it
		if (userInfo) {
			if (userInfo.username) {
				setUsername(userInfo.username);
			} else if (userInfo.name) {
				setUsername(userInfo.name);
			} else if (userInfo.displayName) {
				setUsername(userInfo.displayName);
			} else if (userInfo.email) {
				// Use part before @ in email as username if no name is provided
				setUsername(userInfo.email.split('@')[0]);
			}
			return;
		}

		// If userInfo not provided, get current user and fetch from database
		const currentUser = auth.currentUser;
		if (!currentUser) return;

		const userRef = ref(db, `users/${currentUser.uid}`);

		// Setup realtime listener for user data
		const unsubscribe = onValue(userRef, (snapshot) => {
			if (snapshot.exists()) {
				const userData = snapshot.val();
				if (userData.username) {
					setUsername(userData.username);
				} else if (userData.name) {
					setUsername(userData.name);
				} else if (userData.displayName) {
					setUsername(userData.displayName);
				} else if (userData.email) {
					setUsername(userData.email.split('@')[0]);
				}
			}
		}, (error) => {
			console.error("Error fetching user data:", error);
		});

		// Cleanup listener on unmount
		return () => unsubscribe();
	}, [userInfo]);

	return (
		<header className="w-full">
			{/* Top Bar */}
			<div className="bg-[#5C3D00] text-white px-4 md:px-8 py-7 flex justify-between items-center text-sm font-medium">
				<span>Welcome back, {username}</span>
				<button className="md:hidden" onClick={toggleSidebar}>
					<HiMenuAlt2 className="text-xl" />
				</button>
			</div>

			{/* Alert Bar */}
			{/* <div className="bg-[#FFE6C9] flex justify-between items-center px-4 md:px-8 py-3 border-b border-[#e6b076]">
				<div className="flex items-center gap-2 text-[#3F2600] text-sm font-semibold">
					<MdRocketLaunch className="text-xl" />
					<span>LindaSalesPro has an update</span>
				</div>
				<button className="cursor-pointer bg-[#FF9900] text-white text-xs px-4 py-1 rounded hover:bg-[#e68400] transition">
					Download Now
				</button>
			</div> */}
		</header>
	);
}