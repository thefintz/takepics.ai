sequenceDiagram
    participant User
    participant FormSubmitImage
    participant API
    participant ReplicateInferenceService
    participant Database
    participant Replicate

    User->>FormSubmitImage: Selects category and prompt
    User->>FormSubmitImage: Clicks "Create Images" button
    FormSubmitImage->>API: POST /api/inference
    API->>ReplicateInferenceService: create(user, prompt, lora)
    ReplicateInferenceService->>Replicate: predictions.create()
    Replicate-->>ReplicateInferenceService: Return prediction
    ReplicateInferenceService->>Database: Insert creation
    Database-->>ReplicateInferenceService: Return creation
    ReplicateInferenceService-->>API: Return creation
    API-->>FormSubmitImage: Return creation data
    FormSubmitImage->>FormSubmitImage: Emit 'response' event
    FormSubmitImage->>User: Update UI (show loading state)