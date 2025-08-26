<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255|min:1',
            'content' => 'required|string|max:10000|min:1',
            'tags' => 'nullable|string|max:500',
            'is_important' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Not başlığı gereklidir.',
            'title.max' => 'Not başlığı 255 karakterden fazla olamaz.',
            'title.min' => 'Not başlığı en az 1 karakter olmalıdır.',
            'content.required' => 'Not içeriği gereklidir.',
            'content.max' => 'Not içeriği 10.000 karakterden fazla olamaz.',
            'content.min' => 'Not içeriği en az 1 karakter olmalıdır.',
            'tags.max' => 'Etiketler 500 karakterden fazla olamaz.',
        ];
    }

    public function prepareForValidation(): void
    {
        // Remove sanitization that's causing issues - let validation handle this
        // Sanitization will be done in the model or controller if needed
    }

    public function getProcessedTags(): array
    {
        if (empty($this->tags)) {
            return [];
        }

        return array_filter(
            array_map('trim', explode(',', $this->tags)),
            fn ($tag) => ! empty($tag) && strlen($tag) <= 50
        );
    }
}
