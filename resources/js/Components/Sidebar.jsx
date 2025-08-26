import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Sidebar({ collapsed, show, onClose, isMobile, user }) {
	const [activeFilter, setActiveFilter] = useState('all');

	const menuItems = [
		{
			label: 'Dashboard',
			icon: 'fas fa-home',
			href: route('dashboard'),
			filter: 'all'
		},
		{
			label: 'Tüm Notlar',
			icon: 'fas fa-sticky-note',
			href: route('dashboard', { filter: 'all' }),
			filter: 'all'
		},
		{
			label: 'Favoriler',
			icon: 'fas fa-star',
			href: route('dashboard', { filter: 'favorites' }),
			filter: 'favorites'
		},
		{
			label: 'Arşiv',
			icon: 'fas fa-archive',
			href: route('dashboard', { filter: 'archived' }),
			filter: 'archived'
		},
	];

	return (
		<div className={`
            fixed top-0 left-0 h-full sidebar text-white z-50 transition-all duration-300
            ${collapsed ? 'w-20' : 'w-72'}
            ${isMobile ? (show ? 'translate-x-0' : '-translate-x-full') : ''}
        `}>
			{/* Header */}
			<div className="p-6 border-b border-white border-opacity-10">
				<h4 className={`text-xl font-semibold flex items-center ${collapsed ? 'justify-center' : ''}`}>
					<i className="fas fa-sticky-note mr-3"></i>
					{!collapsed && <span>NotePad</span>}
				</h4>
			</div>

			{/* Menu */}
			<nav className="py-4">
				{menuItems.map((item, index) => (
					<Link
						key={index}
						href={item.href}
						onClick={() => {
							setActiveFilter(item.filter);
							if (isMobile) onClose();
						}}
						className={`
                            flex items-center px-6 py-3 text-white text-opacity-80 
                            hover:text-white hover:bg-white hover:bg-opacity-10 
                            hover:pl-8 transition-all duration-300
                            ${activeFilter === item.filter ? 'bg-white bg-opacity-10 text-white pl-8' : ''}
                            ${collapsed ? 'justify-center px-0' : ''}
                        `}
					>
						<i className={`${item.icon} w-5 text-center ${collapsed ? '' : 'mr-3'}`}></i>
						{!collapsed && <span>{item.label}</span>}
					</Link>
				))}
			</nav>

			{/* User Section */}
			<div className="absolute bottom-0 w-full p-4">
				<Link
					href={route('logout')}
					method="post"
					className={`
                        flex items-center text-white text-opacity-80 
                        hover:text-white transition-colors duration-300
                        ${collapsed ? 'justify-center' : ''}
                    `}
				>
					<i className={`fas fa-sign-out-alt ${collapsed ? '' : 'mr-3'}`}></i>
					{!collapsed && <span>Çıkış Yap</span>}
				</Link>
			</div>
		</div>
	);
}