<?php

use App\Models\Note;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('note belongs to user', function () {
    $user = User::factory()->create();
    $note = Note::factory()->create(['user_id' => $user->id]);

    expect($note->user)->toBeInstanceOf(User::class);
    expect($note->user->id)->toBe($user->id);
});

test('note tags are cast to array', function () {
    $note = Note::factory()->create(['tags' => ['tag1', 'tag2', 'tag3']]);

    expect($note->tags)->toBeArray();
    expect($note->tags)->toBe(['tag1', 'tag2', 'tag3']);
});

test('note booleans are cast correctly', function () {
    $note = Note::factory()->create([
        'is_important' => true,
        'is_favorite' => false,
        'is_archived' => true,
    ]);

    expect($note->is_important)->toBeBool();
    expect($note->is_favorite)->toBeBool();
    expect($note->is_archived)->toBeBool();
    expect($note->is_important)->toBe(true);
    expect($note->is_favorite)->toBe(false);
    expect($note->is_archived)->toBe(true);
});

test('formatted date attribute returns human readable time', function () {
    $note = Note::factory()->create(['created_at' => now()->subHours(2)]);

    expect($note->formatted_date)->toBeString();
    expect($note->formatted_date)->toContain('hours ago');
});

test('for user scope filters notes by user', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    Note::factory()->count(3)->create(['user_id' => $user1->id]);
    Note::factory()->count(2)->create(['user_id' => $user2->id]);

    $user1Notes = Note::forUser($user1->id)->get();
    $user2Notes = Note::forUser($user2->id)->get();

    expect($user1Notes)->toHaveCount(3);
    expect($user2Notes)->toHaveCount(2);
    expect($user1Notes->pluck('user_id')->unique()->first())->toBe($user1->id);
});

test('not archived scope filters out archived notes', function () {
    $user = User::factory()->create();
    Note::factory()->count(3)->create(['user_id' => $user->id, 'is_archived' => false]);
    Note::factory()->count(2)->create(['user_id' => $user->id, 'is_archived' => true]);

    $notArchived = Note::forUser($user->id)->notArchived()->get();

    expect($notArchived)->toHaveCount(3);
    expect($notArchived->pluck('is_archived')->unique()->first())->toBe(false);
});

test('favorites scope filters favorite notes', function () {
    $user = User::factory()->create();
    Note::factory()->count(2)->create(['user_id' => $user->id, 'is_favorite' => true]);
    Note::factory()->count(3)->create(['user_id' => $user->id, 'is_favorite' => false]);

    $favorites = Note::forUser($user->id)->favorites()->get();

    expect($favorites)->toHaveCount(2);
    expect($favorites->pluck('is_favorite')->unique()->first())->toBe(true);
});

test('archived scope filters archived notes', function () {
    $user = User::factory()->create();
    Note::factory()->count(2)->create(['user_id' => $user->id, 'is_archived' => true]);
    Note::factory()->count(3)->create(['user_id' => $user->id, 'is_archived' => false]);

    $archived = Note::forUser($user->id)->archived()->get();

    expect($archived)->toHaveCount(2);
    expect($archived->pluck('is_archived')->unique()->first())->toBe(true);
});

test('search scope filters notes by title and content', function () {
    $user = User::factory()->create();

    Note::factory()->create([
        'user_id' => $user->id,
        'title' => 'Laravel Tutorial',
        'content' => 'Learning Laravel framework',
    ]);

    Note::factory()->create([
        'user_id' => $user->id,
        'title' => 'React Guide',
        'content' => 'Building applications with Laravel backend',
    ]);

    Note::factory()->create([
        'user_id' => $user->id,
        'title' => 'Vue.js Basics',
        'content' => 'Frontend development',
    ]);

    $searchResults = Note::forUser($user->id)->search('Laravel')->get();

    expect($searchResults)->toHaveCount(2);
    expect($searchResults->pluck('title')->toArray())->toContain('Laravel Tutorial');
    expect($searchResults->pluck('title')->toArray())->toContain('React Guide');
});

test('note can have empty tags array', function () {
    $note = Note::factory()->create(['tags' => []]);

    expect($note->tags)->toBeArray();
    expect($note->tags)->toBeEmpty();
});

test('note fillable attributes are correct', function () {
    $note = new Note;
    $expected = [
        'user_id',
        'title',
        'content',
        'tags',
        'is_important',
        'is_favorite',
        'is_archived',
    ];

    expect($note->getFillable())->toBe($expected);
});
