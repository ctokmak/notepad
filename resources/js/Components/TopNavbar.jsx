import { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function TopNavbar({ onToggleSidebar, user, onSearch }) {
	const [searchTerm, setSearchTerm] = useState('');
	const [showUserMenu, setShowUserMenu] = useState(false);

	const handleSearch = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		if (onSearch) {
			onSearch(value);
		}
	};

	return (
		<div className="bg-white shadow-lg px-6 py-4 flex justify-between items-center">
			{/* Left Section */}
			<div className="flex items-center">
				<button
					onClick={onToggleSidebar}
					className="text-gray-700 hover:text-gray-900 text-xl mr-4 focus:outline-none"
				>
					<i className="fas fa-bars"></i>
				</button>

				<div className="relative">
					<input
						type="text"
						value={searchTerm}
						onChange={handleSearch}
						className="search-box"
						placeholder="Notlarda ara..."
					/>
					<i className="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
				</div>
			</div>

			{/* Right Section */}
			<div className="flex items-center">
				<div className="relative">
					<button
						onClick={() => setShowUserMenu(!showUserMenu)}
						className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
					>
						<i className="fas fa-user-circle text-3xl text-blue-600"></i>
						<i className="fas fa-chevron-down ml-2 text-sm"></i>
					</button>

					{showUserMenu && (
						<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
							<div className="px-4 py-2 text-sm text-gray-700 border-b">
								<div className="font-semibold">{user.name}</div>
								<div className="text-gray-500">{user.email}</div>
							</div>

							<Link
								href={route('profile.edit')}
								className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								<i className="fas fa-user mr-2"></i>
								Profil
							</Link>

							<hr className="my-1" />

							<Link
								href={route('logout')}
								method="post"
								className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								<i className="fas fa-sign-out-alt mr-2"></i>
								Çıkış
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}