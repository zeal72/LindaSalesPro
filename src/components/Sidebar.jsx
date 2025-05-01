import { FaSignOutAlt } from "react-icons/fa";
import { BsPersonLinesFill } from "react-icons/bs";
import { FaUserFriends, FaEnvelope, FaCalendarAlt, FaQuestionCircle, FaDollarSign, FaCog } from "react-icons/fa";
import { MdOutlineGroupAdd } from "react-icons/md";
import { auth } from "../../Firebase.config"; // Make sure path is correct
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
	{ name: "Offers", icon: <BsPersonLinesFill />, path: "/" },
	{ name: "Leads", icon: <BsPersonLinesFill />, path: "/leads" },
	{ name: "Customers", icon: <FaUserFriends />, path: "/customers" },
	{ name: "Lead Gen", icon: <MdOutlineGroupAdd />, path: "/lead-gen" },
	{ name: "Messaging", icon: <FaEnvelope />, path: "/messaging" },
	{ name: "Appointment", icon: <FaCalendarAlt />, path: "/appointments" },
	{ name: "Help", icon: <FaQuestionCircle />, path: "/help" },
	{ name: "Sell", icon: <FaDollarSign />, path: "/sell" },
	{ name: "Settings", icon: <FaCog />, path: "/settings" },
];

export default function Sidebar({ isOpen, onClose, userInfo = {}, onLogout }) {
	const [profileImage, setProfileImage] = useState(null);
	const [username, setUsername] = useState("Guest");
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	// Set user data when it changes
	useEffect(() => {
		// Safely handle userInfo which might be undefined or null
		if (userInfo) {
			// Handle username with optional chaining
			if (userInfo?.username) {
				setUsername(userInfo.username);
			} else if (userInfo?.name) {
				setUsername(userInfo.name);
			} else if (userInfo?.displayName) {
				setUsername(userInfo.displayName);
			} else if (userInfo?.email) {
				// Use part before @ in email as username if no name is provided
				setUsername(userInfo.email.split('@')[0]);
			} else {
				// Fallback to default if no user identifiers are found
				setUsername("Guest");
			}

			// Handle profile image with optional chaining
			setProfileImage(userInfo?.photoURL || null);
		} else {
			// Default values when userInfo is undefined or null
			setUsername("Guest");
			setProfileImage(null);
		}
	}, [userInfo]);

	// Handle logout
	const handleLogout = async () => {
		try {
			setIsLoggingOut(true);

			// Close sidebar on mobile if onClose function exists
			if (onClose) {
				onClose();
			}

			// If onLogout function was passed as prop, use it
			if (onLogout) {
				await onLogout();
			} else {
				// Otherwise use the default Firebase logout
				await auth.signOut();
				await new Promise((resolve) => setTimeout(resolve, 2000)); // Add a 2-second timeout
				toast.success("Logged out successfully");
			}
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Failed to log out: " + (error?.message || "Unknown error"));
		} finally {
			setIsLoggingOut(false);
		}
	};

	// Generate initials for avatar fallback
	const getInitials = () => {
		if (!username || username === "Guest") return "G";
		return username.charAt(0).toUpperCase();
	};

	return (
		<aside
			className={`fixed top-0 left-0 h-screen z-50 bg-[#FF9900] text-white w-[240px] flex flex-col justify-between transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex overflow-y-scroll lg:overflow-hidden`}
		>
			<div className="px-6 pt-6">
				<h1 className="text-xl font-bold mb-10">LindasalesPro</h1>
				<ul className="space-y-4 text-[15px] font-medium">
					{menuItems.map((item, index) => (
						<li key={index}>
							<NavLink
								to={item.path}
								onClick={() => onClose && onClose()}
								className={({ isActive }) => `
                  flex items-center space-x-2 px-4 py-2 rounded cursor-pointer transition
                  ${isActive ? 'bg-white text-[#FF9900]' : 'hover:bg-white hover:text-[#FF9900]'}
                `}
							>
								{item.icon}
								<span>{item.name}</span>
							</NavLink>
						</li>
					))}
				</ul>
			</div>

			<div className="px-6 pb-6 mt-2">
				<div className="flex items-center space-x-2 text-sm mb-4 bg-white text-[#FF9900] px-3 py-2 rounded">
					{profileImage ? (
						<img
							src={profileImage}
							alt="Profile"
							className="h-8 w-8 rounded-full object-cover border-2 border-[#FF9900]"
							onError={(e) => {
								// Fallback if image fails to load
								e.target.onerror = null;
								setProfileImage(null);
							}}
						/>
					) : (
						<div className="h-8 w-8 rounded-full bg-[#FF9900] text-white flex items-center justify-center font-semibold">
							{getInitials()}
						</div>
					)}
					<span className="truncate max-w-[150px]" title={username}>
						{username}
					</span>
				</div>

				<button
					onClick={handleLogout}
					disabled={isLoggingOut}
					className="flex items-center w-full space-x-2 text-white hover:text-[#FF9900] hover:bg-white px-4 py-2 rounded transition disabled:opacity-70"
				>
					{isLoggingOut ? (
						<>
							<div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
							<span>Logging out...</span>
						</>
					) : (
						<>
							<FaSignOutAlt />
							<span>Logout</span>
						</>
					)}
				</button>
			</div>
		</aside>
	);
}