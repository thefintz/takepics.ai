sequenceDiagram
    participant Replicate
    participant Webhook
    participant Supabase
    participant Database

    Replicate->>Webhook: POST /api/webhooks/replicate
    Webhook->>Webhook: Validate webhook payload
    Webhook->>Replicate: Fetch image from URL
    Replicate-->>Webhook: Return image data
    Webhook->>Supabase: Upload image to storage
    Supabase-->>Webhook: Return public URL
    Webhook->>Database: Update creation with URL and data
    Database-->>Webhook: Confirm update
    Webhook-->>Replicate: Return "OK"