<?php

use App\Models\Note;
use App\Models\User;
use App\Policies\NotePolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->policy = new NotePolicy;
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
});

test('user can view their own note', function () {
    $note = Note::factory()->create(['user_id' => $this->user->id]);

    expect($this->policy->view($this->user, $note))->toBe(true);
});

test('user cannot view other users note', function () {
    $note = Note::factory()->create(['user_id' => $this->otherUser->id]);

    expect($this->policy->view($this->user, $note))->toBe(false);
});

test('user can create notes', function () {
    expect($this->policy->create($this->user))->toBe(true);
});

test('user can update their own note', function () {
    $note = Note::factory()->create(['user_id' => $this->user->id]);

    expect($this->policy->update($this->user, $note))->toBe(true);
});

test('user cannot update other users note', function () {
    $note = Note::factory()->create(['user_id' => $this->otherUser->id]);

    expect($this->policy->update($this->user, $note))->toBe(false);
});

test('user can delete their own note', function () {
    $note = Note::factory()->create(['user_id' => $this->user->id]);

    expect($this->policy->delete($this->user, $note))->toBe(true);
});

test('user cannot delete other users note', function () {
    $note = Note::factory()->create(['user_id' => $this->otherUser->id]);

    expect($this->policy->delete($this->user, $note))->toBe(false);
});
