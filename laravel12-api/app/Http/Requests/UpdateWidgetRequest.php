<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWidgetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware and controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $widgetId = $this->route('widget');
        
        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'min:2',
                'max:100',
                'regex:/^[a-zA-Z0-9\s\-_]+$/',
                Rule::unique('widgets')->where(function ($query) {
                    return $query->where('created_by', auth()->id());
                })->ignore($widgetId)
            ],
            'description' => 'sometimes|nullable|string|max:1000',
            'template' => [
                'sometimes',
                'required',
                'string',
                Rule::in(['default', 'minimal', 'modern', 'enterprise'])
            ],
            'primary_color' => [
                'sometimes',
                'required',
                'string',
                'regex:/^#[0-9A-F]{6}$/i'
            ],
            'position' => [
                'sometimes',
                'required',
                'string',
                Rule::in(['bottom-right', 'bottom-left', 'top-right', 'top-left'])
            ],
            'welcome_message' => [
                'sometimes',
                'required',
                'string',
                'min:5',
                'max:200'
            ],
            'placeholder' => [
                'sometimes',
                'required',
                'string',
                'min:3',
                'max:50'
            ],
            'bot_name' => [
                'sometimes',
                'required',
                'string',
                'min:2',
                'max:30'
            ],
            'bot_avatar' => [
                'sometimes',
                'nullable',
                'url',
                'max:500'
            ],
            'auto_open' => 'sometimes|boolean',
            'widget_theme' => [
                'sometimes',
                'required',
                'string',
                Rule::in(['light', 'dark'])
            ],
            'widget_width' => [
                'sometimes',
                'required',
                'integer',
                'min:250',
                'max:450'
            ],
            'widget_height' => [
                'sometimes',
                'required',
                'integer',
                'min:400',
                'max:600'
            ],
            'auto_trigger' => 'sometimes|nullable|array',
            'auto_trigger.enabled' => 'sometimes|boolean',
            'auto_trigger.delay' => 'sometimes|integer|min:1|max:60',
            'auto_trigger.message' => 'sometimes|nullable|string|max:150',
            'ai_model' => 'sometimes|nullable|string|max:100',
            'knowledge_base' => 'sometimes|nullable|array',
            'knowledge_base.*' => 'string|max:255',
            'status' => [
                'sometimes',
                'required',
                'string',
                Rule::in(['active', 'inactive', 'draft'])
            ],
            'is_active' => 'sometimes|boolean'
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
        // Convert boolean strings to actual booleans
        if ($this->has('auto_open')) {
            $this->merge(['auto_open' => $this->boolean('auto_open')]);
        }
        
        if ($this->has('is_active')) {
            $this->merge(['is_active' => $this->boolean('is_active')]);
        }

        // Ensure auto_trigger has proper structure if provided
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
     * Get the validated data with user tracking.
     */
    public function validatedWithUser(): array
    {
        $validated = $this->validated();
        $validated['updated_by'] = auth()->id();
        
        return $validated;
    }
}
