<?php

use App\Models\Note;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('user can get their notes', function () {
    $notes = Note::factory()->count(3)->create(['user_id' => $this->user->id]);
    $otherUserNote = Note::factory()->create(); // Different user

    $response = $this->getJson('/api/notes');

    $response->assertOk()
        ->assertJsonStructure([
            'notes' => [
                '*' => ['id', 'title', 'content', 'tags', 'is_important', 'is_favorite', 'is_archived', 'created_at', 'updated_at'],
            ],
            'success',
        ])
        ->assertJsonCount(3, 'notes');
});

test('user can create a note', function () {
    $noteData = [
        'title' => 'Test Note',
        'content' => 'This is a test note content',
        'tags' => 'test, example',
        'is_important' => true,
    ];

    $response = $this->postJson('/api/notes', $noteData);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'note' => ['id', 'title', 'content', 'tags', 'is_important', 'user_id'],
            'success',
            'message',
        ]);

    $this->assertDatabaseHas('notes', [
        'user_id' => $this->user->id,
        'title' => 'Test Note',
        'content' => 'This is a test note content',
        'is_important' => 1, // SQLite stores boolean as integer
    ]);
});

test('user cannot create note with invalid data', function () {
    $response = $this->postJson('/api/notes', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'content']);
});

test('user can update their own note', function () {
    $note = Note::factory()->create(['user_id' => $this->user->id]);

    $updateData = [
        'title' => 'Updated Title',
        'content' => 'Updated content',
        'tags' => 'updated, test',
        'is_important' => false,
    ];

    $response = $this->putJson("/api/notes/{$note->id}", $updateData);

    $response->assertOk()
        ->assertJsonStructure([
            'note' => ['id', 'title', 'content', 'tags', 'is_important'],
            'success',
            'message',
        ]);

    $this->assertDatabaseHas('notes', [
        'id' => $note->id,
        'title' => 'Updated Title',
        'content' => 'Updated content',
    ]);
});

test('user cannot update another users note', function () {
    $otherUser = User::factory()->create();
    $note = Note::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->putJson("/api/notes/{$note->id}", [
        'title' => 'Hacked Title',
        'content' => 'Hacked content',
    ]);

    $response->assertForbidden();
});

test('user can delete their own note', function () {
    $note = Note::factory()->create(['user_id' => $this->user->id]);

    $response = $this->deleteJson("/api/notes/{$note->id}");

    $response->assertOk()
        ->assertJson(['success' => true]);

    $this->assertDatabaseMissing('notes', ['id' => $note->id]);
});

test('user cannot delete another users note', function () {
    $otherUser = User::factory()->create();
    $note = Note::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->deleteJson("/api/notes/{$note->id}");

    $response->assertForbidden();
});

test('user can toggle note favorite status', function () {
    $note = Note::factory()->create(['user_id' => $this->user->id, 'is_favorite' => false]);

    $response = $this->postJson("/api/notes/{$note->id}/toggle-favorite");

    $response->assertOk()
        ->assertJson(['success' => true]);

    $this->assertDatabaseHas('notes', [
        'id' => $note->id,
        'is_favorite' => true,
    ]);
});

test('user can toggle note archive status', function () {
    $note = Note::factory()->create(['user_id' => $this->user->id, 'is_archived' => false]);

    $response = $this->postJson("/api/notes/{$note->id}/toggle-archive");

    $response->assertOk()
        ->assertJson(['success' => true]);

    $this->assertDatabaseHas('notes', [
        'id' => $note->id,
        'is_archived' => true,
    ]);
});

test('user can get notes statistics', function () {
    // Create various notes for testing stats
    Note::factory()->count(5)->create(['user_id' => $this->user->id]);
    Note::factory()->count(2)->create(['user_id' => $this->user->id, 'is_favorite' => true]);
    Note::factory()->count(1)->create(['user_id' => $this->user->id, 'is_archived' => true]);
    Note::factory()->count(3)->create(['user_id' => $this->user->id, 'created_at' => now()]);

    $response = $this->getJson('/api/notes-stats');

    $response->assertOk()
        ->assertJsonStructure([
            'stats' => ['total', 'today', 'favorites', 'archived'],
            'success',
        ])
        ->assertJson([
            'stats' => [
                'total' => 11,
                'today' => 3,
                'favorites' => 2,
                'archived' => 1,
            ],
        ]);
});

test('notes are filtered by search term', function () {
    Note::factory()->create([
        'user_id' => $this->user->id,
        'title' => 'Laravel Tutorial',
        'content' => 'Learning Laravel framework',
    ]);

    Note::factory()->create([
        'user_id' => $this->user->id,
        'title' => 'React Guide',
        'content' => 'Building React applications',
    ]);

    $response = $this->getJson('/api/notes?search=Laravel');

    $response->assertOk()
        ->assertJsonCount(1, 'notes');
});

test('notes are sorted correctly', function () {
    $firstNote = Note::factory()->create([
        'user_id' => $this->user->id,
        'title' => 'A First Note',
        'created_at' => now()->subDays(2),
    ]);

    $secondNote = Note::factory()->create([
        'user_id' => $this->user->id,
        'title' => 'B Second Note',
        'created_at' => now()->subDay(),
    ]);

    // Test title sorting
    $response = $this->getJson('/api/notes?sort=title');
    $response->assertOk();
    $notes = $response->json('notes');
    expect($notes[0]['title'])->toBe('A First Note');

    // Test date sorting (default)
    $response = $this->getJson('/api/notes?sort=date');
    $response->assertOk();
    $notes = $response->json('notes');
    expect($notes[0]['id'])->toBe($secondNote->id);
});
