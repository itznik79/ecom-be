export const MESSAGES = {
    SUCCESS: 'Operation successful',
    ERROR: 'An error occurred',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden resource',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation failed',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    CREATED: 'Resource created successfully',
    // Dynamic messages
    NOT_FOUND_ENTITY: (entity: string) => `${entity} not found`,
    EXISTS_ENTITY: (entity: string) => `${entity} already exists`,
    CREATED_ENTITY: (entity: string) => `${entity} created successfully`,
    UPDATED_ENTITY: (entity: string) => `${entity} updated successfully`,
    DELETED_ENTITY: (entity: string) => `${entity} deleted successfully`,
};
