import { Column, DataType, Model, Table, PrimaryKey, Default, ForeignKey, BelongsTo } from "sequelize-typescript";
import { v4 as uuidv4 } from 'uuid';
import { IVariantAttributeValues } from "../types";
import { Attributes } from './attributes.model';
import { AttributeValue } from './attribute-values.model';
import { ProductVariant } from './product-variants.model';

@Table({ tableName: 'variant_attribute_values', timestamps: true, underscored: true })
export class VariantAttributeValues extends Model<IVariantAttributeValues> {
    @PrimaryKey
    @Default(() => uuidv4())
    @Column(DataType.UUID)
    id?: string;

    @ForeignKey(() => Attributes)
    @Column({ type: DataType.UUID, allowNull: false })
    attribute_id: string;

    @BelongsTo(() => Attributes)
    attribute?: Attributes;

    @ForeignKey(() => AttributeValue)
    @Column({ type: DataType.UUID, allowNull: false })
    attribute_value_id: string;

    @BelongsTo(() => AttributeValue)
    attributeValue?: AttributeValue;

    @ForeignKey(() => ProductVariant)
    @Column({ type: DataType.UUID, allowNull: false })
    variant_id: string;

    @BelongsTo(() => ProductVariant)
    variant?: ProductVariant;
}