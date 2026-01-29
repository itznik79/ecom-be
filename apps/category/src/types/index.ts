export interface ICategory {
    id: string;
    parent_id?: string;
    name: string;
    slug: string;
    description?: string;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}
