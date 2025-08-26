import { useState, useEffect } from 'react';

export default function Toast({ message, type = 'success', isVisible, onClose, duration = 3000 }) {
	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(() => {
				onClose();
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [isVisible, duration, onClose]);

	if (!isVisible) return null;

	const getToastClasses = () => {
		const baseClasses = "fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300";

		switch (type) {
			case 'success':
				return `${baseClasses} bg-green-500 text-white`;
			case 'error':
				return `${baseClasses} bg-red-500 text-white`;
			case 'warning':
				return `${baseClasses} bg-yellow-500 text-white`;
			case 'info':
				return `${baseClasses} bg-blue-500 text-white`;
			default:
				return `${baseClasses} bg-gray-800 text-white`;
		}
	};

	const getIcon = () => {
		switch (type) {
			case 'success':
				return 'fas fa-check-circle';
			case 'error':
				return 'fas fa-exclamation-circle';
			case 'warning':
				return 'fas fa-exclamation-triangle';
			case 'info':
				return 'fas fa-info-circle';
			default:
				return 'fas fa-bell';
		}
	};

	return (
		<div className={getToastClasses()}>
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<i className={`${getIcon()} mr-3`}></i>
					<span>{message}</span>
				</div>
				<button
					onClick={onClose}
					className="ml-4 text-white hover:text-gray-200 focus:outline-none"
				>
					<i className="fas fa-times"></i>
				</button>
			</div>
		</div>
	);
}