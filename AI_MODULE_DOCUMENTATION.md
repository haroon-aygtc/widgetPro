# AI Provider & Model Configuration Module

## 🎯 Overview

This module provides a complete AI Provider and Model management system that allows users to:
- Connect to multiple AI providers (OpenAI, Anthropic, Google, Groq, etc.)
- Validate API keys in real-time
- Fetch and store available models from each provider
- Manage user-specific AI configurations
- No default models or auto-save - everything is user-driven and click-based

## 🔄 Data Flow

### 1. **User Interface (Frontend)**
- User sees available AI providers
- User selects a provider → enters API key
- User clicks **"Connect"**

### 2. **API Key Test & Configure**
- Frontend calls: `POST /api/ai-providers/provider/test` → Validates API key
- If valid: `POST /api/ai-providers/provider/configure` → Saves API key and fetches models

### 3. **Backend Processing**
- Validates request data
- Tests API key with real provider endpoint
- Stores user provider configuration in `user_ai_providers`
- Fetches available models and stores in `ai_models`
- Returns success with available models

### 4. **Model Selection**
- User sees available models with details (context window, pricing, etc.)
- User selects models → clicks "Add to Database"
- Frontend calls: `POST /api/ai-providers/store-user-models`

## 📊 Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `ai_providers` | Master list of supported providers (seeded) |
| `ai_models` | Available models from providers |
| `user_ai_providers` | User's API keys per provider |
| `user_ai_models` | User's selected models |

### Key Relationships
```
users → user_ai_providers → ai_providers
users → user_ai_models → ai_models
user_ai_providers → user_ai_models
```

## 🛠 API Endpoints

### Provider Management
```
GET    /api/ai-providers/provider              # Get all providers
POST   /api/ai-providers/provider/test         # Test API key
POST   /api/ai-providers/provider/configure    # Configure provider
GET    /api/ai-providers/user-providers        # Get user providers
PUT    /api/ai-providers/update-user-providers/status  # Update status
DELETE /api/ai-providers/delete-user-providers/{id}    # Delete provider
```

### Model Management
```
GET    /api/ai-providers/{provider_id}/available-models  # Fetch models
GET    /api/ai-providers/user-models                     # Get user models
POST   /api/ai-providers/store-user-models               # Add model
PUT    /api/ai-providers/update-user-models/{id}         # Update model
DELETE /api/ai-providers/delete-user-models/{id}         # Delete model
```

## 🎨 Frontend Components

### Main Components
- `AIModelConfig.tsx` - Main configuration interface
- `AIProviders.tsx` - Provider management
- `useAIProviders.ts` - React hook for API integration

### Key Features
- **Modern UI** - Glassmorphism, animations, responsive design
- **Search & Filter** - Real-time provider/model filtering
- **Grid/List Views** - Flexible layout options
- **Progress Tracking** - Visual step-by-step configuration
- **Toast Notifications** - User-friendly success/error messages

## 🔧 Backend Architecture

### Controllers
- `AIProviderController` - Provider operations
- `UserProviderController` - User provider management
- `UserModelController` - User model management

### Services
- `AIProviderService` - Provider business logic
- `UserProviderService` - User provider operations
- `UserModelService` - User model operations
- `AIModelService` - Model fetching and storage

### Models
- `AIProvider` - Provider entity
- `AIModel` - Model entity
- `UserAIProvider` - User-provider relationship
- `UserAIModel` - User-model relationship

## 🚀 Key Features

### ✅ Production Ready
- **Comprehensive validation** on both frontend and backend
- **Error handling** with user-friendly messages
- **Database transactions** for data consistency
- **API rate limiting** and security
- **Unit tests** included

### ✅ User Experience
- **Click-based approach** - minimal typing required
- **Real-time validation** - immediate feedback
- **Progressive disclosure** - step-by-step configuration
- **Smart defaults** - intelligent pre-configuration
- **Responsive design** - works on all devices

### ✅ Developer Experience
- **Clean architecture** - separation of concerns
- **Consistent patterns** - follows Laravel/React best practices
- **Type safety** - full TypeScript integration
- **Reusable components** - modular design
- **Comprehensive documentation**

## 🔒 Security & Validation

### Backend Validation
```php
// Provider configuration
$request->validate([
    'provider_id' => 'required|integer|exists:ai_providers,id',
    'api_key' => 'required|string'
]);

// Model storage
$request->validate([
    'model_id' => 'required|integer|exists:ai_models,id',
    'user_provider_id' => 'required|integer|exists:user_ai_providers,id',
    'custom_name' => 'nullable|string|max:255'
]);
```

### Frontend Validation
- Real-time form validation with Zod
- API key format validation
- Required field highlighting
- Error state management

## 📱 Usage Examples

### Configure Provider
```typescript
const { configureProvider } = useAIProviders();

const handleConnect = async () => {
  try {
    const { userProvider, availableModels } = await configureProvider(
      providerId, 
      apiKey
    );
    // Provider configured successfully
  } catch (error) {
    // Handle error with toast notification
  }
};
```

### Add Model
```typescript
const { addUserModel } = useAIProviders();

const handleAddModel = async () => {
  try {
    await addUserModel({
      model_id: selectedModel.id,
      user_provider_id: userProvider.id,
      custom_name: "My Custom Model Name"
    });
    // Model added successfully
  } catch (error) {
    // Handle error
  }
};
```

## 🧪 Testing

Run the comprehensive test suite:
```bash
php artisan test tests/Feature/AIProviderTest.php
```

Tests cover:
- Provider listing and configuration
- API key validation
- Model fetching and storage
- User provider management
- Error handling and validation
- Authentication requirements

## 🎯 No Default Models Policy

This module follows a strict **user-driven approach**:
- ❌ No default models are pre-selected
- ❌ No auto-save functionality
- ✅ User must explicitly select and add models
- ✅ All actions require user confirmation
- ✅ Clear feedback for every operation

This ensures users have full control over their AI configuration and understand exactly what models they're using.
