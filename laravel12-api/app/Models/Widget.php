<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Widget extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'template',
        'primary_color',
        'position',
        'welcome_message',
        'placeholder',
        'bot_name',
        'bot_avatar',
        'auto_open',
        'widget_theme',
        'widget_width',
        'widget_height',
        'auto_trigger',
        'ai_model',
        'knowledge_base',
        'status',
        'is_active',
        'embed_code',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'auto_open' => 'boolean',
        'is_active' => 'boolean',
        'widget_width' => 'integer',
        'widget_height' => 'integer',
        'auto_trigger' => 'array',
        'knowledge_base' => 'array',
        'total_conversations' => 'integer',
        'total_messages' => 'integer',
        'avg_response_time' => 'decimal:2',
        'satisfaction_score' => 'decimal:2',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate embed code when creating
        static::creating(function ($widget) {
            if (empty($widget->embed_code)) {
                $widget->embed_code = static::generateEmbedCode();
            }
        });

        // Update embed code when updating
        static::updating(function ($widget) {
            if ($widget->isDirty(['name', 'template', 'primary_color', 'position'])) {
                $widget->embed_code = static::generateEmbedCode($widget->id);
            }
        });
    }

    /**
     * Get the user who created the widget.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated the widget.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Scope a query to search widgets.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('bot_name', 'like', "%{$search}%");
        });
    }

    /**
     * Scope a query to filter by template.
     */
    public function scopeTemplate($query, $template)
    {
        return $query->where('template', $template);
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to filter by active status.
     */
    public function scopeActive($query, $isActive = true)
    {
        return $query->where('is_active', $isActive);
    }

    /**
     * Scope a query to filter by creator.
     */
    public function scopeCreatedBy($query, $userId)
    {
        return $query->where('created_by', $userId);
    }

    /**
     * Generate production-ready embed code for the widget.
     */
    public static function generateEmbedCode($widgetId = null): string
    {
        $id = $widgetId ?: 'WIDGET_ID';
        $baseUrl = config('app.url');

        // Production embed code with proper error handling
        return "<script>
(function() {
    try {
        var script = document.createElement('script');
        script.src = '{$baseUrl}/js/widget.min.js';
        script.setAttribute('data-widget-id', '{$id}');
        script.setAttribute('data-widget-version', '1.0');
        script.async = true;
        script.defer = true;

        script.onerror = function() {
            console.warn('ChatWidget: Failed to load widget script');
        };

        document.head.appendChild(script);
    } catch (error) {
        console.warn('ChatWidget: Error initializing widget', error);
    }
})();
</script>";
    }

    /**
     * Get the widget's configuration as an array.
     */
    public function getConfigurationAttribute(): array
    {
        return [
            'widgetName' => $this->name,
            'selectedTemplate' => $this->template,
            'primaryColor' => $this->primary_color,
            'widgetPosition' => $this->position,
            'autoOpen' => $this->auto_open,
            'widgetTheme' => $this->widget_theme,
            'widgetWidth' => $this->widget_width,
            'widgetHeight' => $this->widget_height,
            'botName' => $this->bot_name,
            'welcomeMessage' => $this->welcome_message,
            'botAvatar' => $this->bot_avatar ?: 'https://api.dicebear.com/7.x/avataaars/svg?seed=assistant',
            'placeholder' => $this->placeholder,
            'autoTrigger' => $this->auto_trigger ?: [
                'enabled' => false,
                'delay' => 5,
                'message' => 'Need help? I\'m here to assist you!'
            ],
            'aiModel' => $this->ai_model ?: '',
            'knowledgeBase' => $this->knowledge_base ?: [],
        ];
    }

    /**
     * Update analytics data.
     */
    public function updateAnalytics(array $data): void
    {
        $this->update([
            'total_conversations' => $data['total_conversations'] ?? $this->total_conversations,
            'total_messages' => $data['total_messages'] ?? $this->total_messages,
            'avg_response_time' => $data['avg_response_time'] ?? $this->avg_response_time,
            'satisfaction_score' => $data['satisfaction_score'] ?? $this->satisfaction_score,
        ]);
    }

    /**
     * Duplicate the widget with a new name.
     */
    public function duplicate(string $newName, int $userId): self
    {
        $attributes = $this->toArray();
        unset($attributes['id'], $attributes['created_at'], $attributes['updated_at']);

        $attributes['name'] = $newName;
        $attributes['created_by'] = $userId;
        $attributes['updated_by'] = $userId;
        $attributes['status'] = 'draft';
        $attributes['embed_code'] = null; // Will be auto-generated

        return static::create($attributes);
    }

    /**
     * Toggle the widget's active status.
     */
    public function toggleStatus(): bool
    {
        $this->is_active = !$this->is_active;
        return $this->save();
    }

    /**
     * Check if the widget is ready for deployment.
     */
    public function isReadyForDeployment(): bool
    {
        return !empty($this->name) &&
               !empty($this->welcome_message) &&
               !empty($this->placeholder) &&
               $this->status === 'active';
    }
}
