# Distributed User Registration

This document explains the orchestration flow between the **Auth Service** and **User Service** during the registration process.

## 1. Distributed Logic Flow
Since the system uses separate databases for Auth (credentials) and User (profiles), we use an orchestration pattern with a compensation (rollback) mechanism.

```mermaid
sequenceDiagram
    participant Client
    participant AuthAPI
    participant AuthDB
    participant UserAPI
    participant UserDB

    Client->>AuthAPI: "POST /auth/register (email, password, profile)"
    
    Note over AuthAPI, AuthDB: Step 1: Identity Creation
    AuthAPI->>AuthDB: "Create UserCredential (email, password_hash)"
    AuthDB-->>AuthAPI: Returns user_id
    
    Note over AuthAPI, UserAPI: Step 2: Distributed Call
    AuthAPI->>UserAPI: "POST /users (credential_id, profile_data)"
    
    alt User Profile Success
        UserAPI->>UserDB: Create User, Profile, Default Roles, Default Address
        UserDB-->>UserAPI: Success
        UserAPI-->>AuthAPI: Status 201 Created
        AuthAPI-->>Client: Return Success
    else User Profile Failure
        UserAPI-->>AuthAPI: "Status 4xx/5xx Error"
        Note over AuthAPI, AuthDB: Step 3: Compensation (Rollback)
        AuthAPI->>AuthDB: "DELETE UserCredential (user_id)"
        AuthAPI-->>Client: "Return Error (Failure to create profile)"
    end
```

## 2. Component Breakdown

### Auth Service Responsibility
- Creating and managing the password hash.
- Orchestrating the call to the User Service.
- Handling the rollback if the User Service is down or validation fails.

### User Service Responsibility
- Managing the **UserProfile** (name, phone, avatar).
- Managing **UserAddresses**.
- Assigning the initial **UserRole** (e.g., 'customer').

## 3. Database Schema Mapping
- **Auth Database**: `user_credentials` table (Primary Key: `user_id`).
- **User Database**: `users` table (Primary Key: `id`).
- **Linking**: The `users.credential_id` in the User DB stores the `user_id` from the Auth DB.

## 4. API Interface (UX Context)
The client sends one single request to `/auth/register`. 
- **Internal Error Handling**: The client doesn't see the internal complexity. If the profile creation fails, they get a 500 error, and no stale account is left in the system.
