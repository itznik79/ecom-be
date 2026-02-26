export class IProduct {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
    description: string;
    brand_id: string;
    category_id: string;
    created_at: Date;
updated_at: Date;
}

export class IProductVariant {
    id: string;
    product_id: string;
    sku: string;
    current_price: number;
    compare_at_price?: number;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export class IAttributes {
    id: string;
    name: string;
    code: string
    data_type: string;
    is_filterable: boolean;
    is_variant_level: boolean;
    is_active?: boolean;
    created_at?: Date;
}

export class ICategoryAttributes {
    id: string;
    category_id: string;
    attribute_id: string
    is_filterable: boolean;
    is_required: boolean;
    sort_order: number;
    created_at?: Date;
}

export class IAttributeValues {
    id: string;
    attribute_id: string
    value_text?: string;
    value_number?: number;
    sort_order?: number;
}

export class IVariantAttributeValues {
    id: string;
    attribute_id: string
    attribute_value_id: string
    variant_id: string;
}

export class IProductImage {
    id: string;
    product_id?: string;
    variant_id?: string;
    url: string;
    alt_text: string;
    created_at?: Date;
}