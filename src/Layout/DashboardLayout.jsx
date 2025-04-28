// DashboardLayout.jsx
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { DashboardProvider, useDashboard } from "../components/DashBoardContext";
import { memo } from "react";

const MemoizedSidebar = memo(Sidebar);
const MemoizedHeader = memo(Header);

// Internal component that uses the context
function DashboardContent({ children }) {
	const { sidebarOpen, closeSidebar, toggleSidebar, userInfo, onLogout } = useDashboard();
	const location = useLocation();

	// Determine current active page from URL
	const getCurrentPage = () => {
		const path = location.pathname;
		// Same as before...
		return 'Offers'; // Default
	};

	const currentPage = getCurrentPage();

	return (
		<div className="h-screen flex flex-col md:flex-row">
			<MemoizedSidebar
				isOpen={sidebarOpen}
				onClose={closeSidebar}
				userInfo={userInfo}
				onLogout={onLogout}
			/>

			<div className="flex-1 flex flex-col overflow-hidden">
				<MemoizedHeader
					toggleSidebar={toggleSidebar}
					pageName={currentPage}
					userInfo={userInfo}
				/>

				<main className="bg-[#F5F5F5] p-4 md:p-6 flex-1 overflow-y-auto">
					<div className="w-full max-w-7xl mx-auto">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}

// Wrapper component that provides the context
export default function DashboardLayout({ children, userInfo, onLogout }) {
	return (
		<DashboardProvider userInfo={userInfo} onLogout={onLogout}>
			<DashboardContent>{children}</DashboardContent>
		</DashboardProvider>
	);
}