<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateWidgetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:100',
                'regex:/^[a-zA-Z0-9\s\-_]+$/',
                Rule::unique('widgets')->where(function ($query) {
                    return $query->where('created_by', auth()->id());
                })
            ],
            'description' => 'nullable|string|max:1000',
            'template' => [
                'required',
                'string',
                Rule::in(['default', 'minimal', 'modern', 'enterprise'])
            ],
            'primary_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-F]{6}$/i'
            ],
            'position' => [
                'required',
                'string',
                Rule::in(['bottom-right', 'bottom-left', 'top-right', 'top-left'])
            ],
            'welcome_message' => [
                'required',
                'string',
                'min:5',
                'max:200'
            ],
            'placeholder' => [
                'required',
                'string',
                'min:3',
                'max:50'
            ],
            'bot_name' => [
                'required',
                'string',
                'min:2',
                'max:30'
            ],
            'bot_avatar' => [
                'nullable',
                'url',
                'max:500'
            ],
            'auto_open' => 'boolean',
            'widget_theme' => [
                'required',
                'string',
                Rule::in(['light', 'dark'])
            ],
            'widget_width' => [
                'required',
                'integer',
                'min:250',
                'max:450'
            ],
            'widget_height' => [
                'required',
                'integer',
                'min:400',
                'max:600'
            ],
            'auto_trigger' => 'nullable|array',
            'auto_trigger.enabled' => 'boolean',
            'auto_trigger.delay' => 'integer|min:1|max:60',
            'auto_trigger.message' => 'nullable|string|max:150',
            'ai_model' => 'nullable|string|max:100',
            'knowledge_base' => 'nullable|array',
            'knowledge_base.*' => 'string|max:255',
            'status' => [
                'nullable',
                'string',
                Rule::in(['active', 'inactive', 'draft'])
            ],
            'is_active' => 'boolean'
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Widget name is required.',
            'name.min' => 'Widget name must be at least 2 characters.',
            'name.max' => 'Widget name must be less than 100 characters.',
            'name.regex' => 'Widget name can only contain letters, numbers, spaces, hyphens, and underscores.',
            'name.unique' => 'You already have a widget with this name.',
            'template.required' => 'Template selection is required.',
            'template.in' => 'Please select a valid template.',
            'primary_color.required' => 'Primary color is required.',
            'primary_color.regex' => 'Please enter a valid hex color (e.g., #4f46e5).',
            'position.required' => 'Widget position is required.',
            'position.in' => 'Please select a valid widget position.',
            'welcome_message.required' => 'Welcome message is required.',
            'welcome_message.min' => 'Welcome message must be at least 5 characters.',
            'welcome_message.max' => 'Welcome message must be less than 200 characters.',
            'placeholder.required' => 'Placeholder text is required.',
            'placeholder.min' => 'Placeholder must be at least 3 characters.',
            'placeholder.max' => 'Placeholder must be less than 50 characters.',
            'bot_name.required' => 'Bot name is required.',
            'bot_name.min' => 'Bot name must be at least 2 characters.',
            'bot_name.max' => 'Bot name must be less than 30 characters.',
            'bot_avatar.url' => 'Please enter a valid avatar URL.',
            'widget_theme.required' => 'Widget theme is required.',
            'widget_theme.in' => 'Please select a valid theme.',
            'widget_width.required' => 'Widget width is required.',
            'widget_width.min' => 'Widget width must be at least 250px.',
            'widget_width.max' => 'Widget width must be less than 450px.',
            'widget_height.required' => 'Widget height is required.',
            'widget_height.min' => 'Widget height must be at least 400px.',
            'widget_height.max' => 'Widget height must be less than 600px.',
            'auto_trigger.delay.min' => 'Delay must be at least 1 second.',
            'auto_trigger.delay.max' => 'Delay must be less than 60 seconds.',
            'auto_trigger.message.max' => 'Trigger message must be less than 150 characters.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set default values if not provided
        $this->merge([
            'auto_open' => $this->boolean('auto_open', false),
            'is_active' => $this->boolean('is_active', true),
            'status' => $this->input('status', 'draft'),
            'bot_avatar' => $this->input('bot_avatar') ?: 'https://api.dicebear.com/7.x/avataaars/svg?seed=assistant',
        ]);

        // Ensure auto_trigger has proper structure
        if ($this->has('auto_trigger') && is_array($this->input('auto_trigger'))) {
            $autoTrigger = $this->input('auto_trigger');
            $this->merge([
                'auto_trigger' => [
                    'enabled' => $autoTrigger['enabled'] ?? false,
                    'delay' => $autoTrigger['delay'] ?? 5,
                    'message' => $autoTrigger['message'] ?? 'Need help? I\'m here to assist you!'
                ]
            ]);
        }
    }

    /**
     * Get the validated data with user tracking and proper defaults.
     */
    public function validatedWithUser(): array
    {
        $validated = $this->validated();
        $validated['created_by'] = auth()->id();
        $validated['updated_by'] = auth()->id();

        // Ensure status is set
        if (!isset($validated['status'])) {
            $validated['status'] = 'draft';
        }

        // Ensure proper boolean values
        $validated['auto_open'] = $validated['auto_open'] ?? false;
        $validated['is_active'] = $validated['is_active'] ?? true;

        // Ensure auto_trigger has proper structure
        if (!isset($validated['auto_trigger']) || !is_array($validated['auto_trigger'])) {
            $validated['auto_trigger'] = [
                'enabled' => false,
                'delay' => 5,
                'message' => 'Need help? I\'m here to assist you!'
            ];
        }

        // Ensure knowledge_base is array
        if (!isset($validated['knowledge_base'])) {
            $validated['knowledge_base'] = [];
        }

        return $validated;
    }
}