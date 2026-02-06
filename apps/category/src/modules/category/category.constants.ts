export const CATEGORY_ATTRIBUTES = {
    DROPDOWN: ['id', 'name'],
    DASHBOARD: ['id', 'name', 'status'],
    ADMIN: ['id', 'name', 'status', 'createdAt', 'updatedAt'],
} as const;

export type CategoryView = keyof typeof CATEGORY_ATTRIBUTES;

export const CATEGORY_MESSAGES = {
    PARENT_NOT_FOUND: 'Parent category not found',
    CANNOT_BE_OWN_PARENT: 'Category cannot be its own parent',
    CATEGORY_HAS_CHILDREN: 'Category has children and cannot be deleted',
} as const;