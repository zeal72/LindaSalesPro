// DashboardContext.jsx
import { createContext, useContext, useState } from 'react';

const DashboardContext = createContext(null);

export function DashboardProvider({ children, userInfo, onLogout }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const closeSidebar = () => setSidebarOpen(false);
	const toggleSidebar = () => setSidebarOpen(prev => !prev);

	const value = {
		userInfo,
		onLogout,
		sidebarOpen,
		closeSidebar,
		toggleSidebar
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