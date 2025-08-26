<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = Auth::id();

        // Get notes with filters
        $query = Note::forUser($userId);

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

        // Get statistics
        $stats = [
            'total' => Note::forUser($userId)->count(),
            'today' => Note::forUser($userId)
                ->whereDate('created_at', today())
                ->count(),
            'favorites' => Note::forUser($userId)->favorites()->count(),
            'archived' => Note::forUser($userId)->archived()->count(),
        ];

        return Inertia::render('Dashboard', [
            'notes' => $notes,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'filter' => $request->filter,
                'sort' => $sortBy,
            ],
        ]);
    }
}
