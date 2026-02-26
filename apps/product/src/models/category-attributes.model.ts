import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { ICategoryAttributes } from "../types";
import { Attributes } from './attributes.model';


@Table({ tableName: 'category_attributes', timestamps: true, underscored: true })
export class CategoryAttributes extends Model<ICategoryAttributes> {
    @Column({ type: DataType.UUID, allowNull: false })
    category_id: string;

    @ForeignKey(() => Attributes)
    @Column({ type: DataType.UUID, allowNull: false })
    attribute_id: string;

    @BelongsTo(() => Attributes)
    attribute?: Attributes;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    is_filterable: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    is_required: boolean;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    sort_order: number;
}