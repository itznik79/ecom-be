import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IProduct } from '../types';
import { Brand } from './brands.model';
import { ProductVariant } from './product-variants.model';
import { ProductImages } from './product-images.model';

@Table({ tableName: 'products', timestamps: true, underscored: true })
export class Product extends Model<IProduct> {
    @PrimaryKey
    @Default(() => uuidv4())
    @Column(DataType.UUID)
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    slug: string;

    @ForeignKey(() => Brand)
    @Column({ type: DataType.UUID, allowNull: true })
    brand_id: string;

    @Column({ type: DataType.UUID, allowNull: true })
    category_id: string;

    @BelongsTo(() => Brand)
    brand?: Brand;

    @HasMany(() => ProductVariant)
    variants?: ProductVariant[];

    @HasMany(() => ProductImages)
    images?: ProductImages[];

    @Column(DataType.TEXT)
    description: string;

    @Default(true)
    @Column(DataType.BOOLEAN)
    is_active: boolean;
}