<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'min:2', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users')->ignore($this->route('user'))],
            'password' => ['sometimes', 'string', 'min:8'],
            'password_confirmation' => ['required_with:password', 'string', 'same:password'],
            'status' => ['sometimes', 'in:active,inactive'],
            'role_ids' => ['sometimes', 'array'],
            'role_ids.*' => ['integer', 'exists:roles,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.min' => 'Name must be at least 2 characters',
            'name.max' => 'Name must be less than 255 characters',
            'email.email' => 'Please enter a valid email address',
            'email.unique' => 'This email address is already registered',
            'email.max' => 'Email must be less than 255 characters',
            'password.min' => 'Password must be at least 8 characters',
            'password_confirmation.required_with' => 'Please confirm your password when changing it',
            'password_confirmation.same' => 'Password confirmation does not match',
            'status.in' => 'Status must be either active or inactive',
            'role_ids.array' => 'Roles must be an array',
            'role_ids.*.exists' => 'Selected role does not exist',
        ];
    }
}
