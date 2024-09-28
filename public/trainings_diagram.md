sequenceDiagram
    participant User
    participant TrainForm
    participant useTrainingService
    participant API
    participant TrainingService
    participant Database
    participant Replicate
    participant Supabase

    User->>TrainForm: Fills form and uploads images
    User->>TrainForm: Clicks "Start Training" button
    TrainForm->>TrainForm: Validates form (isFormValid)
    TrainForm->>useTrainingService: Calls startTraining
    useTrainingService->>API: POST /api/training
    API->>TrainingService: Calls startTraining
    TrainingService->>Supabase: Uploads zip file
    Supabase-->>TrainingService: Returns zip URL
    TrainingService->>Replicate: Starts training process
    Replicate-->>TrainingService: Returns training information
    TrainingService->>Database: Saves training data
    Database-->>TrainingService: Confirms data saved
    TrainingService-->>API: Returns training data
    API-->>useTrainingService: Returns response
    useTrainingService-->>TrainForm: Returns data
    TrainForm->>TrainForm: Updates UI (trainingStarted = true)
    TrainForm->>User: Shows success message