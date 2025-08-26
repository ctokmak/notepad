<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Models\Note;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class NoteController extends Controller
{
    use AuthorizesRequests;
    
    public function index(Request $request): JsonResponse
    {
        $query = Note::forUser(Auth::id());

        // Apply filters
        if ($request->has('search') && ! empty($request->search)) {
            $query->search($request->search);
        }

        if ($request->has('filter')) {
            switch ($request->filter) {
                case 'favorites':
                    $query->favorites();
                    break;
                case 'archived':
                    $query->archived();
                    break;
                default:
                    $query->notArchived();
            }
        } else {
            $query->notArchived();
        }

        // Apply sorting
        $sortBy = $request->get('sort', 'date');
        switch ($sortBy) {
            case 'title':
                $query->orderBy('title');
                break;
            case 'updated':
                $query->orderBy('updated_at', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $notes = $query->get();

        return response()->json([
            'notes' => $notes,
            'success' => true,
        ]);
    }

    public function store(StoreNoteRequest $request): JsonResponse
    {
        try {
            $note = Note::create([
                'user_id' => Auth::id(),
                'title' => $request->title,
                'content' => $request->content,
                'tags' => $request->getProcessedTags(),
                'is_important' => $request->boolean('is_important', false),
            ]);

            Log::info('Note created', ['note_id' => $note->id, 'user_id' => Auth::id()]);

            return response()->json([
                'note' => $note->load('user'),
                'success' => true,
                'message' => 'Not başarıyla oluşturuldu!',
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create note', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Not oluşturulurken bir hata oluştu.',
            ], 500);
        }
    }

    public function show(Note $note): JsonResponse
    {
        $this->authorize('view', $note);

        return response()->json([
            'note' => $note,
            'success' => true,
        ]);
    }

    public function update(UpdateNoteRequest $request, Note $note): JsonResponse
    {
        $this->authorize('update', $note);

        try {
            $originalData = $note->toArray();

            $note->update([
                'title' => $request->title,
                'content' => $request->content,
                'tags' => $request->getProcessedTags(),
                'is_important' => $request->boolean('is_important', false),
            ]);

            Log::info('Note updated', [
                'note_id' => $note->id,
                'user_id' => Auth::id(),
                'changes' => $note->getChanges(),
            ]);

            return response()->json([
                'note' => $note->fresh(),
                'success' => true,
                'message' => 'Not başarıyla güncellendi!',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update note', [
                'note_id' => $note->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Not güncellenirken bir hata oluştu.',
            ], 500);
        }
    }

    public function destroy(Note $note): JsonResponse
    {
        $this->authorize('delete', $note);

        try {
            $noteId = $note->id;
            $note->delete();

            Log::info('Note deleted', [
                'note_id' => $noteId,
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Not silindi!',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete note', [
                'note_id' => $note->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Not silinirken bir hata oluştu.',
            ], 500);
        }
    }

    public function toggleFavorite(Note $note): JsonResponse
    {
        $this->authorize('update', $note);

        $note->update([
            'is_favorite' => ! $note->is_favorite,
        ]);

        return response()->json([
            'note' => $note->fresh(),
            'success' => true,
            'message' => $note->is_favorite ?
                'Favorilere eklendi!' : 'Favorilerden kaldırıldı!',
        ]);
    }

    public function toggleArchive(Note $note): JsonResponse
    {
        $this->authorize('update', $note);

        $note->update([
            'is_archived' => ! $note->is_archived,
        ]);

        return response()->json([
            'note' => $note->fresh(),
            'success' => true,
            'message' => $note->is_archived ?
                'Arşivlendi!' : 'Arşivden çıkarıldı!',
        ]);
    }

    public function stats(): JsonResponse
    {
        $userId = Auth::id();

        $stats = [
            'total' => Note::forUser($userId)->count(),
            'today' => Note::forUser($userId)
                ->whereDate('created_at', today())
                ->count(),
            'favorites' => Note::forUser($userId)->favorites()->count(),
            'archived' => Note::forUser($userId)->archived()->count(),
        ];

        return response()->json([
            'stats' => $stats,
            'success' => true,
        ]);
    }
}
