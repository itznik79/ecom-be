import { Column, DataType, Default, Model, PrimaryKey, Table, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import { v4 as uuidv4 } from 'uuid';
import { IProductVariant } from "../types";
import { Product } from './product.model';
import { VariantAttributeValues } from './variant-attribute-values.model';
import { ProductImages } from './product-images.model';


@Table({ tableName: 'product_variants', timestamps: true, underscored: true })
export class ProductVariant extends Model<IProductVariant> {
    @PrimaryKey
    @Default(() => uuidv4())
    @Column(DataType.UUID)
    id?: string

    @ForeignKey(() => Product)
    @Column({ type: DataType.UUID, allowNull: false })
    product_id: string;

    @BelongsTo(() => Product)
    product?: Product;

    @Column({ type: DataType.STRING, allowNull: false })
    sku: string;

    @Column({ type: DataType.DECIMAL(10,2), allowNull: false })
    current_price: string | number;

    @Column({ type: DataType.DECIMAL(10,2), allowNull: true })
    compare_at_price?: string | number;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    is_active: boolean;
    
    @HasMany(() => VariantAttributeValues)
    attributeValues?: VariantAttributeValues[];

    @HasMany(() => ProductImages)
    images?: ProductImages[];
}