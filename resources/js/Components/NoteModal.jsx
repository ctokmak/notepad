import { useState, useEffect } from 'react';

export default function NoteModal({ isOpen, onClose, onSave, note = null }) {
	const [formData, setFormData] = useState({
		title: '',
		content: '',
		tags: '',
		is_important: false
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (note) {
			setFormData({
				title: note.title || '',
				content: note.content || '',
				tags: note.tags ? note.tags.join(', ') : '',
				is_important: note.is_important || false
			});
		} else {
			setFormData({
				title: '',
				content: '',
				tags: '',
				is_important: false
			});
		}
	}, [note, isOpen]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await onSave(formData, note?.id);
			onClose();
		} catch (error) {
			console.error('Error saving note:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-lg">
					<div className="flex justify-between items-center">
						<h5 className="text-xl font-semibold">
							{note ? 'Notu Düzenle' : 'Yeni Not Oluştur'}
						</h5>
						<button
							onClick={onClose}
							className="text-white hover:text-gray-200 focus:outline-none"
						>
							<i className="fas fa-times text-xl"></i>
						</button>
					</div>
				</div>

				{/* Body */}
				<form onSubmit={handleSubmit} className="p-6">
					<div className="mb-4">
						<label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
							Başlık
						</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						/>
					</div>

					<div className="mb-4">
						<label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
							İçerik
						</label>
						<textarea
							id="content"
							name="content"
							value={formData.content}
							onChange={handleChange}
							rows="8"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						/>
					</div>

					<div className="mb-4">
						<label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
							Etiketler
						</label>
						<input
							type="text"
							id="tags"
							name="tags"
							value={formData.tags}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Virgülle ayırarak etiketler ekleyin"
						/>
						<p className="text-sm text-gray-500 mt-1">Örnek: iş, proje, önemli</p>
					</div>

					<div className="mb-6">
						<div className="flex items-center">
							<input
								type="checkbox"
								id="is_important"
								name="is_important"
								checked={formData.is_important}
								onChange={handleChange}
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label htmlFor="is_important" className="ml-2 block text-sm text-gray-700">
								<i className="fas fa-star text-yellow-500 mr-1"></i>
								Önemli olarak işaretle
							</label>
						</div>
					</div>

					{/* Footer */}
					<div className="flex justify-end gap-3">
						<button
							type="button"
							onClick={onClose}
							className="btn-outline-primary-custom"
							disabled={isLoading}
						>
							İptal
						</button>
						<button
							type="submit"
							className="btn-primary-custom flex items-center"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<i className="fas fa-spinner fa-spin mr-2"></i>
									Kaydediliyor...
								</>
							) : (
								<>
									<i className="fas fa-save mr-2"></i>
									Kaydet
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}