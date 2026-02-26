import { Column, DataType, Default, Model, PrimaryKey, Table, HasMany } from "sequelize-typescript";
import { v4 as uuidv4 } from 'uuid';
import { IAttributes } from "../types";
import { AttributeValue } from './attribute-values.model';
import { CategoryAttributes } from './category-attributes.model';
import { VariantAttributeValues } from './variant-attribute-values.model';


@Table({ tableName: 'attributes', timestamps: true, underscored: true })
export class Attributes extends Model<IAttributes> {
    @PrimaryKey
    @Default(() => uuidv4())
    @Column(DataType.UUID)
    id?: string

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    code: string;

    @Column({ type: DataType.STRING, allowNull: false })
    data_type: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    is_filterable: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    is_variant_level: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    is_active: boolean;

    
    @HasMany(() => AttributeValue)
    values?: AttributeValue[];

    @HasMany(() => CategoryAttributes)
    categoryAttributes?: CategoryAttributes[];

    @HasMany(() => VariantAttributeValues)
    variantAttributeValues?: VariantAttributeValues[];
}