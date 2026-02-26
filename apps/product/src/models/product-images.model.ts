import { Column, DataType, Default, Model, PrimaryKey, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { v4 as uuidv4 } from 'uuid';
import { IProductImage } from "../types";
import { Product } from './product.model';
import { ProductVariant } from './product-variants.model';


@Table({ tableName: 'product_images', timestamps: true, underscored: true })
export class ProductImages extends Model<IProductImage> {
    @PrimaryKey
    @Default(() => uuidv4())
    @Column(DataType.UUID)
    id?: string

    @ForeignKey(() => Product)
    @Column({ type: DataType.UUID, allowNull: true })
    product_id?: string;

    @BelongsTo(() => Product)
    product?: Product;

    @ForeignKey(() => ProductVariant)
    @Column({ type: DataType.UUID, allowNull: true })
    variant_id?: string;

    @BelongsTo(() => ProductVariant)
    variant?: ProductVariant;

    @Column({ type: DataType.STRING, allowNull: false })
    url: string;

    @Column({ type: DataType.STRING, allowNull: false })
    alt_text: string;
}