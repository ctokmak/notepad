import { useState } from 'react';

export default function DeleteModal({ isOpen, onClose, onConfirm, noteTitle = '' }) {
	const [isLoading, setIsLoading] = useState(false);

	const handleConfirm = async () => {
		setIsLoading(true);
		try {
			await onConfirm();
			onClose();
		} catch (error) {
			console.error('Error deleting note:', error);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full">
				{/* Header */}
				<div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
					<div className="flex justify-between items-center">
						<h5 className="text-xl font-semibold">Not Sil</h5>
						<button
							onClick={onClose}
							className="text-white hover:text-gray-200 focus:outline-none"
							disabled={isLoading}
						>
							<i className="fas fa-times text-xl"></i>
						</button>
					</div>
				</div>

				{/* Body */}
				<div className="p-6">
					<div className="flex items-center mb-4">
						<div className="flex-shrink-0">
							<i className="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
						</div>
						<div className="ml-4">
							<p className="text-gray-700">
								<span className="font-semibold">"{noteTitle}"</span> adlı notu silmek istediğinizden emin misiniz?
							</p>
							<p className="text-gray-500 text-sm mt-2">
								Bu işlem geri alınamaz.
							</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
						disabled={isLoading}
					>
						İptal
					</button>
					<button
						onClick={handleConfirm}
						className="btn-danger-custom flex items-center"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<i className="fas fa-spinner fa-spin mr-2"></i>
								Siliniyor...
							</>
						) : (
							<>
								<i className="fas fa-trash mr-2"></i>
								Sil
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}