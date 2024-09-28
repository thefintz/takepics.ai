sequenceDiagram
    participant Replicate
    participant Webhook
    participant TrainingService
    participant Database

    Replicate->>Webhook: POST /api/webhooks/replicate-trainings
    Webhook->>Webhook: Validate webhook payload
    Webhook->>TrainingService: updateTrainingStatus(id, status, modelUrl)
    TrainingService->>Database: Update training status and model URL
    Database-->>TrainingService: Confirm update
    TrainingService-->>Webhook: Update complete
    Webhook-->>Replicate: Return success message