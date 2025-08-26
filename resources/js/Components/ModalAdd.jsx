import React from "react";

const ModalAdd = ({ isOpen, onClose }) => {
	if (!isOpen) return null;

	return (
		<div className="modal fade" id="noteModal" tabIndex={-1}>
			<div className="modal-dialog modal-lg">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="modalTitle">Yeni Not Oluştur</h5>
						<button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" />
					</div>
					<div className="modal-body">
						<form id="noteForm">
							<input type="hidden" id="noteId" name="id" />
							<div className="mb-3">
								<label htmlFor="noteTitle" className="form-label">Başlık</label>
								<input type="text" className="form-control" id="noteTitle" name="title" required />
							</div>
							<div className="mb-3">
								<label htmlFor="noteContent" className="form-label">İçerik</label>
								<textarea className="form-control" id="noteContent" name="content" rows={8} required defaultValue={""} />
							</div>
							<div className="mb-3">
								<label htmlFor="noteTags" className="form-label">Etiketler</label>
								<input type="text" className="form-control" id="noteTags" name="tags" placeholder="Virgülle ayırarak etiketler ekleyin" />
								<div className="form-text">Örnek: iş, proje, önemli</div>
							</div>
							<div className="mb-3">
								<div className="form-check">
									<input className="form-check-input" type="checkbox" id="noteImportant" name="important" />
									<label className="form-check-label" htmlFor="noteImportant">
										<i className="fas fa-star text-warning" /> Önemli olarak işaretle
									</label>
								</div>
							</div>
						</form>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-outline-primary-custom" data-bs-dismiss="modal">İptal</button>
						<button type="button" className="btn btn-primary-custom" id="saveNoteBtn">
							<i className="fas fa-save me-2" />Kaydet
						</button>
					</div>
				</div>
			</div>
		</div>

	);
};

export default ModalAdd;