import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function Layout({ children }) {
	const { auth } = usePage().props;
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [sidebarShow, setSidebarShow] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth <= 768;
			setIsMobile(mobile);

			if (mobile) {
				setSidebarCollapsed(false);
				setSidebarShow(false);
			}
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const toggleSidebar = () => {
		if (isMobile) {
			setSidebarShow(!sidebarShow);
		} else {
			setSidebarCollapsed(!sidebarCollapsed);
		}
	};

	const closeSidebar = () => {
		if (isMobile) {
			setSidebarShow(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Sidebar */}
			<Sidebar
				collapsed={sidebarCollapsed}
				show={sidebarShow}
				onClose={closeSidebar}
				isMobile={isMobile}
				user={auth.user}
			/>

			{/* Main Content */}
			<div
				className={`transition-all duration-300 min-h-screen ${isMobile
						? 'ml-0'
						: sidebarCollapsed
							? 'ml-20'
							: 'ml-72'
					}`}
			>
				<TopNavbar
					onToggleSidebar={toggleSidebar}
					user={auth.user}
				/>

				<main>
					{children}
				</main>
			</div>

			{/* Mobile Overlay */}
			{isMobile && sidebarShow && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40"
					onClick={closeSidebar}
				/>
			)}
		</div>
	);
}