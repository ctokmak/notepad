import { useState, memo } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import { CONSTANTS } from '../constants';

const NoteCard = memo(function NoteCard({ note, onEdit, onDelete, onToggleFavorite, onToggleArchive, isListView = false }) {
	const [showMenu, setShowMenu] = useState(false);
	const menuRef = useClickOutside(() => setShowMenu(false));

	const handleMenuClick = (action) => {
		setShowMenu(false);
		action();
	};

	const truncateText = (text, maxLength = CONSTANTS.TEXT_TRUNCATE_LENGTH) => {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength) + '...';
	};

	return (
		<div className={`note-card mb-4 ${isListView ? 'w-full' : ''}`}>
			{/* Header */}
			<div className="flex justify-between items-start p-5 pb-0">
				<h5 className="text-lg font-semibold text-gray-800 mb-0">
					{note.title}
				</h5>

				<div className="relative" ref={menuRef}>
					<button
						onClick={() => setShowMenu(!showMenu)}
						className="text-gray-400 hover:text-gray-600 focus:outline-none"
						aria-label="Note actions"
					>
						<i className="fas fa-ellipsis-v"></i>
					</button>

					{showMenu && (
						<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
							<button
								onClick={() => handleMenuClick(onEdit)}
								className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								<i className="fas fa-edit mr-2"></i>
								Düzenle
							</button>

							<button
								onClick={() => handleMenuClick(onToggleFavorite)}
								className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								<i className={`fas fa-star mr-2 ${note.is_favorite ? 'text-yellow-500' : ''}`}></i>
								{note.is_favorite ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
							</button>

							<button
								onClick={() => handleMenuClick(onToggleArchive)}
								className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								<i className="fas fa-archive mr-2"></i>
								{note.is_archived ? 'Arşivden Çıkar' : 'Arşivle'}
							</button>

							<hr className="my-1" />

							<button
								onClick={() => handleMenuClick(onDelete)}
								className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
							>
								<i className="fas fa-trash mr-2"></i>
								Sil
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Content */}
			<div className="px-5 py-0">
				<p className="text-gray-700 leading-relaxed overflow-hidden">
					{isListView ? note.content : truncateText(note.content)}
				</p>
			</div>

			{/* Footer */}
			<div className="flex justify-between items-center px-5 py-4 pt-4 border-t border-gray-200 mt-4">
				<small className="text-gray-500">
					{note.formatted_date}
				</small>

				<div className="flex gap-1">
					{note.is_important && (
						<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
							<i className="fas fa-star mr-1"></i>
							Önemli
						</span>
					)}

					{note.tags && note.tags.map((tag, index) => (
						<span
							key={index}
							className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
						>
							{tag}
						</span>
					))}
				</div>
			</div>
		</div>
	);
});

export default NoteCard;