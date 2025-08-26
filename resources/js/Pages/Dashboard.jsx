import { useState, useEffect, useCallback, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import Layout from '../Components/Layout';
import NoteCard from '../Components/NoteCard';
import NoteModal from '../Components/NoteModal';
import DeleteModal from '../Components/DeleteModal';
import Toast from '../Components/Toast';
import LoadingSpinner from '../Components/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import apiService from '../services/api';
import { CONSTANTS } from '../constants';

export default function Dashboard({ notes: initialNotes, stats, filters = {} }) {
    const [notes, setNotes] = useState(initialNotes);
    const [currentStats, setCurrentStats] = useState(stats);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [deletingNote, setDeletingNote] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [sortBy, setSortBy] = useState(filters.sort || CONSTANTS.SORT_OPTIONS.DATE);
    const [isGridView, setIsGridView] = useState(true);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: CONSTANTS.TOAST_TYPES.SUCCESS });
    const [loading, setLoading] = useState({
        notes: false,
        stats: false,
        save: false,
        delete: false,
        favorite: null,
        archive: null
    });
    
    const debouncedSearchTerm = useDebounce(searchTerm, CONSTANTS.SEARCH_DEBOUNCE_DELAY);

    // Memoized filtered and sorted notes
    const filteredNotes = useMemo(() => {
        let filtered = [...notes];

        // Apply search filter
        if (debouncedSearchTerm.trim()) {
            filtered = filtered.filter(note =>
                note.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                note.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case CONSTANTS.SORT_OPTIONS.TITLE:
                    return a.title.localeCompare(b.title);
                case CONSTANTS.SORT_OPTIONS.UPDATED:
                    return new Date(b.updated_at) - new Date(a.updated_at);
                default: // date
                    return new Date(b.created_at) - new Date(a.created_at);
            }
        });

        return filtered;
    }, [notes, debouncedSearchTerm, sortBy]);


    const showToast = useCallback((message, type = CONSTANTS.TOAST_TYPES.SUCCESS) => {
        setToast({ isVisible: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, isVisible: false }));
        }, CONSTANTS.TOAST_DISPLAY_TIME);
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, isVisible: false }));
    }, []);

    const fetchNotes = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, notes: true }));
            const data = await apiService.getNotes();
            if (data.success) {
                setNotes(data.notes);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
            showToast('Notlar yüklenirken hata oluştu', CONSTANTS.TOAST_TYPES.ERROR);
        } finally {
            setLoading(prev => ({ ...prev, notes: false }));
        }
    }, [showToast]);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, stats: true }));
            const data = await apiService.getNotesStats();
            if (data.success) {
                setCurrentStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(prev => ({ ...prev, stats: false }));
        }
    }, []);

    const handleSaveNote = useCallback(async (formData, noteId = null) => {
        try {
            setLoading(prev => ({ ...prev, save: true }));
            
            // Optimistic update for edit
            if (noteId) {
                setNotes(prev => prev.map(note => 
                    note.id === noteId ? { ...note, ...formData } : note
                ));
            }
            
            const data = noteId 
                ? await apiService.updateNote(noteId, formData)
                : await apiService.createNote(formData);

            if (data.success) {
                showToast(data.message);
                
                // Update with server response
                if (noteId) {
                    setNotes(prev => prev.map(note => 
                        note.id === noteId ? data.note : note
                    ));
                } else {
                    setNotes(prev => [data.note, ...prev]);
                }
                
                await fetchStats();
                setIsNoteModalOpen(false);
                setEditingNote(null);
            } else {
                // Revert optimistic update on error
                if (noteId) {
                    await fetchNotes();
                }
                showToast('Not kaydedilirken hata oluştu', CONSTANTS.TOAST_TYPES.ERROR);
            }
        } catch (error) {
            console.error('Error saving note:', error);
            // Revert optimistic update on error
            if (noteId) {
                await fetchNotes();
            }
            showToast('Not kaydedilirken hata oluştu', CONSTANTS.TOAST_TYPES.ERROR);
        } finally {
            setLoading(prev => ({ ...prev, save: false }));
        }
    }, [showToast, fetchNotes, fetchStats]);

    const handleDeleteNote = useCallback(async () => {
        if (!deletingNote) return;

        try {
            setLoading(prev => ({ ...prev, delete: true }));
            
            // Optimistic update
            const originalNotes = notes;
            setNotes(prev => prev.filter(note => note.id !== deletingNote.id));

            const data = await apiService.deleteNote(deletingNote.id);

            if (data.success) {
                showToast(data.message);
                await fetchStats();
                setIsDeleteModalOpen(false);
                setDeletingNote(null);
            } else {
                // Revert optimistic update on error
                setNotes(originalNotes);
                showToast('Not silinirken hata oluştu', CONSTANTS.TOAST_TYPES.ERROR);
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            // Revert optimistic update on error
            await fetchNotes();
            showToast('Not silinirken hata oluştu', CONSTANTS.TOAST_TYPES.ERROR);
        } finally {
            setLoading(prev => ({ ...prev, delete: false }));
        }
    }, [deletingNote, notes, showToast, fetchNotes, fetchStats]);

    const handleToggleFavorite = useCallback(async (note) => {
        try {
            setLoading(prev => ({ ...prev, favorite: note.id }));
            
            // Optimistic update
            const originalNotes = notes;
            setNotes(prev => prev.map(n => 
                n.id === note.id ? { ...n, is_favorite: !n.is_favorite } : n
            ));

            const data = await apiService.toggleNoteFavorite(note.id);

            if (data.success) {
                showToast(data.message);
                // Update with server response
                setNotes(prev => prev.map(n => 
                    n.id === note.id ? data.note : n
                ));
                await fetchStats();
            } else {
                // Revert optimistic update on error
                setNotes(originalNotes);
                showToast('İşlem gerçekleştirilemedi', CONSTANTS.TOAST_TYPES.ERROR);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            // Revert optimistic update on error
            setNotes(notes);
            showToast('İşlem gerçekleştirilemedi', CONSTANTS.TOAST_TYPES.ERROR);
        } finally {
            setLoading(prev => ({ ...prev, favorite: null }));
        }
    }, [notes, showToast, fetchStats]);

    const handleToggleArchive = useCallback(async (note) => {
        try {
            setLoading(prev => ({ ...prev, archive: note.id }));
            
            // Optimistic update
            const originalNotes = notes;
            setNotes(prev => prev.map(n => 
                n.id === note.id ? { ...n, is_archived: !n.is_archived } : n
            ));

            const data = await apiService.toggleNoteArchive(note.id);

            if (data.success) {
                showToast(data.message);
                // Update with server response
                setNotes(prev => prev.map(n => 
                    n.id === note.id ? data.note : n
                ));
                await fetchStats();
            } else {
                // Revert optimistic update on error
                setNotes(originalNotes);
                showToast('İşlem gerçekleştirilemedi', CONSTANTS.TOAST_TYPES.ERROR);
            }
        } catch (error) {
            console.error('Error toggling archive:', error);
            // Revert optimistic update on error
            setNotes(notes);
            showToast('İşlem gerçekleştirilemedi', CONSTANTS.TOAST_TYPES.ERROR);
        } finally {
            setLoading(prev => ({ ...prev, archive: null }));
        }
    }, [notes, showToast, fetchStats]);

    const handleEditNote = useCallback((note) => {
        setEditingNote(note);
        setIsNoteModalOpen(true);
    }, []);

    const handleDeleteClick = useCallback((note) => {
        setDeletingNote(note);
        setIsDeleteModalOpen(true);
    }, []);

    const handleAddNote = useCallback(() => {
        setEditingNote(null);
        setIsNoteModalOpen(true);
    }, []);

    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
    }, []);

    const handleSortChange = useCallback((e) => {
        setSortBy(e.target.value);
    }, []);

    const toggleView = useCallback(() => {
        setIsGridView(!isGridView);
    }, [isGridView]);
    
    // Keyboard shortcuts
    useKeyboardShortcuts({
        [CONSTANTS.SHORTCUTS.NEW_NOTE]: handleAddNote,
        [CONSTANTS.SHORTCUTS.SEARCH]: () => {
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) searchInput.focus();
        },
    });

    return (
        <Layout>
            <Head title="Dashboard" />

            <div className="container-fluid p-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="stats-card">
                        <div className="stats-number text-blue-600">{currentStats.total}</div>
                        <div className="text-gray-500">Toplam Not</div>
                    </div>
                    <div className="stats-card">
                        <div className="stats-number text-green-600">{currentStats.today}</div>
                        <div className="text-gray-500">Bugün Eklenen</div>
                    </div>
                    <div className="stats-card">
                        <div className="stats-number text-yellow-600">{currentStats.favorites}</div>
                        <div className="text-gray-500">Favori</div>
                    </div>
                    <div className="stats-card">
                        <div className="stats-number text-indigo-600">{currentStats.archived}</div>
                        <div className="text-gray-500">Arşivlenen</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-0">Notlarım</h2>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="form-select px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={CONSTANTS.SORT_OPTIONS.DATE}>Tarihe Göre</option>
                            <option value={CONSTANTS.SORT_OPTIONS.TITLE}>Başlığa Göre</option>
                            <option value={CONSTANTS.SORT_OPTIONS.UPDATED}>Son Güncelleme</option>
                        </select>

                        <button
                            onClick={toggleView}
                            className="btn-outline-primary-custom px-3 py-2"
                        >
                            <i className={`fas ${isGridView ? 'fa-list' : 'fa-th'}`}></i>
                        </button>
                    </div>
                </div>

                {/* Notes Grid */}
                {loading.notes ? (
                    <div className="flex justify-center items-center py-16">
                        <LoadingSpinner size="lg" text="Notlar yükleniyor..." />
                    </div>
                ) : filteredNotes.length > 0 ? (
                    <div className={`grid gap-6 ${isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                        {filteredNotes.map((note) => (
                            <div key={note.id} className="relative">
                                <NoteCard
                                    note={note}
                                    onEdit={() => handleEditNote(note)}
                                    onDelete={() => handleDeleteClick(note)}
                                    onToggleFavorite={() => handleToggleFavorite(note)}
                                    onToggleArchive={() => handleToggleArchive(note)}
                                    isListView={!isGridView}
                                />
                                {(loading.favorite === note.id || loading.archive === note.id) && (
                                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                                        <LoadingSpinner size="sm" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <i className="fas fa-sticky-note text-6xl text-gray-300 mb-4"></i>
                        <h4 className="text-xl text-gray-600 mb-2">
                            {debouncedSearchTerm ? 'Arama sonucu bulunamadı' : 'Henüz Not Yok'}
                        </h4>
                        <p className="text-gray-500 mb-6">
                            {debouncedSearchTerm
                                ? 'Farklı anahtar kelimelerle tekrar deneyin.'
                                : 'İlk notunuzu oluşturmak için aşağıdaki butona tıklayın.'
                            }
                        </p>
                        {!debouncedSearchTerm && (
                            <button
                                onClick={handleAddNote}
                                className="btn-primary-custom"
                                disabled={loading.save}
                            >
                                <i className="fas fa-plus mr-2"></i>
                                İlk Notunu Oluştur
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <button
                onClick={handleAddNote}
                className="fab-button"
            >
                <i className="fas fa-plus"></i>
            </button>

            {/* Note Modal */}
            <NoteModal
                isOpen={isNoteModalOpen}
                onClose={() => {
                    setIsNoteModalOpen(false);
                    setEditingNote(null);
                }}
                onSave={handleSaveNote}
                note={editingNote}
            />

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingNote(null);
                }}
                onConfirm={handleDeleteNote}
                noteTitle={deletingNote?.title || ''}
            />

            {/* Toast */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </Layout>
    );
}