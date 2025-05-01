import { createContext, useContext, useState } from 'react';

const DashboardContext = createContext(null);

export function DashboardProvider({ children, userInfo = null, onLogout = () => { } }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Simulate userInfo loading - in a real app, you'd check auth state
	// or fetch user data, and use this state to show loading indicators
	useState(() => {
		// This simulates checking if userInfo is ready
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 500);
		return () => clearTimeout(timer);
	}, [userInfo]);

	const closeSidebar = () => setSidebarOpen(false);
	const toggleSidebar = () => setSidebarOpen(prev => !prev);

	const value = {
		userInfo,
		onLogout,
		sidebarOpen,
		closeSidebar,
		toggleSidebar,
		isLoading
	};

	return (
		<DashboardContext.Provider value={value}>
			{children}
		</DashboardContext.Provider>
	);
}

export const useDashboard = () => {
	const context = useContext(DashboardContext);
	if (!context) {
		throw new Error('useDashboard must be used within a DashboardProvider');
	}
	return context;
};